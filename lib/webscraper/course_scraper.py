from bs4 import BeautifulSoup
import requests
from time_converter import TimeParser
from pymongo import MongoClient
import json

# parse fields thorugh index
def fields(i):
    if i == 0:
        return "Section"
    elif i == 1:
        return "CourseID"
    elif i == 5:
        return "Type"
    elif i == 6:
        return "Days"
    elif i == 7:
        return "Time"
    elif i == 9:
        return "Location"
    elif i == 10:
        return "Instructor"


def parse_courses(url, courses, building_codes):
    url = "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2025/By_Subject/" + url
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')
    # use pageContent to naviagte the DOM and grab all sections of each course
    page_content = soup.find(id="pageContent")
    course_block = page_content.find(class_="courseBlock")
    while course_block:
        course = f"{course_block.find(class_='courseCode').text} {course_block.find(class_='courseTitle').text}"
        courses[course] = []
        # grab all sections for each course
        sections = course_block.find("tr").find_next_siblings()
        for count, section in enumerate(sections):
            # each row's info for a section
            courses[course].append([])
            data = {}
            for i, element in enumerate(section):
                if (i < 2 or i > 4) and i != 8 and i != 11:
                    field = fields(i)
                    data[field] = element.text
                    courses[course][count].append(data[field])
                    if i == 9:
                        # find the appropriate building for each classroom
                        key = element.text.split("-")[0]
                        building_codes[key].add(element.text)
        course_block = course_block.find_next_sibling(class_="courseBlock")

def get_all_course_links():
    url = "http://web.csulb.edu/depts/enrollment/registration/class_schedule/Spring_2025/By_Subject/"
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "html.parser")
    links = []
    for link in soup.find_all('a'):
        string = link.get("href")
        if string is not None and string[0].isupper():
            links.append(string)
    return links

def get_building_codes(building_codes):
    url = "https://www.csulb.edu/maps/building-names-codes"
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "html.parser")
    table_body = soup.find("table")
    table_rows = table_body.find_all("tr")
    for row in table_rows:
        building_code = row.find("td").text
        if building_code.isupper():
            building_codes[building_code] = set()
    # hardcode some edge case buildings
    building_codes["ONLINE"] = set()
    building_codes["SPA"] = set()
    building_codes["NA"] = set()
    building_codes["SSC"] = set()
    building_codes["MM"] = set()
    building_codes["OFF"] = set()
    building_codes["DC"] = set()
    building_codes["FLD"] = set()
    building_codes["RNG"] = set()
    building_codes["CTS"] = set()
    building_codes["SWM"] = set()
    building_codes["CINE"] = set()


building_codes = {}
courses = {}
get_building_codes(building_codes)
links = get_all_course_links()

for link in links:
    parse_courses(link, courses, building_codes)

formatted_courses = []

t = TimeParser()

for course_name, sections in courses.items():
    formatted_course = {
        "courseName": course_name,
        "sections": []
    }
    for section in sections:
        parsed_times = t.set_time(section[4])
        formatted_course["sections"].append(
            {
                "sectionNumber": section[0],
                "courseID": section[1],
                "courseType": section[2],
                "days": section[3],
                "startTime": parsed_times[0],
                "endTime": parsed_times[1],
                "location": section[5],
                "instructor": section[6]
            })
    formatted_courses.append(formatted_course)

with open("courses.json", "w") as jsonfile:
    json.dump(formatted_courses, jsonfile, indent=4)
