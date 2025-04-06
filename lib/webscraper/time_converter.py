MIN_TO_HOUR = 60

class TimeParser:
    def __init__(self):
        self.time = None
    
    # gives the total number of minutes for each beginning and end time of a class, returned a tuple
    def convert_time_to_mins(self, time):
        # take care of class times not occuring at a whole hour mark
        if ":" in time:
            time = time.split(":")
            hour = int(time[0])
            mins = int(time[1])
            mins = hour * MIN_TO_HOUR + mins
            return mins
        else:
            hour = int(time)
            mins = hour * MIN_TO_HOUR
            return mins

    # parses the time given from the webscraper 
    def parse_times(self):
        self.time = self.time.split("-")
        start_time = self.time[0]
        end_time = self.time[1][:-2]
        meridiem = self.time[1][-2:]

        start_time_mins = self.convert_time_to_mins(start_time) 
        end_time_mins = self.convert_time_to_mins(end_time)
        #  account for edge case where "am" is greater than pm", e.g. 11am > 1pm
        if start_time_mins > end_time_mins:
            end_time_mins += 12 * MIN_TO_HOUR
        else:
            if meridiem == "PM":
                if end_time_mins < 720 or end_time_mins >= 780:
                    start_time_mins = start_time_mins + 12 * MIN_TO_HOUR
                    end_time_mins = end_time_mins + 12 * MIN_TO_HOUR

        self.military_time([start_time_mins, end_time_mins])
        

    # converts parsed time to military time for easier querying later on
    def military_time(self, times):
        result = []
        # converts start and end times to military time
        for time in times:
            hours = time // MIN_TO_HOUR
            mins = time % MIN_TO_HOUR
            # add 0 as a prefix to the time
            if mins < 10:
                mins = f"0{mins}"
            if hours < 10:
                hours = f"0{hours}"
            result.append(f"{hours}:{mins}") 
        self.time = result

    # function to reususe instance of TimeParser for all sections scraped from the schedule of classrooms
    def set_time(self, time):
        self.time = time
        # account for asynchronous classes
        if self.time == "NA":
            self.time = ["NA", "NA"]
            return self.return_time()
        self.parse_times()

    # returns the tuple of military times - start time and end time
    def return_time(self):
        return self.time
