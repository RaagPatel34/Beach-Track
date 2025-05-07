MIN_TO_HOUR = 60

class TimeParser:
    def __init__(self):
        self.time = None
    
    def convert_time_to_mins(self, time):
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

    def parse_times(self):
        self.time = self.time.split("-")
        start_time = self.time[0]
        end_time = self.time[1][:-2]
        meridiem = self.time[1][-2:]

        start_time_mins = self.convert_time_to_mins(start_time) 
        end_time_mins = self.convert_time_to_mins(end_time)
        if start_time_mins > end_time_mins:
            end_time_mins += 12 * MIN_TO_HOUR
        else:
            if meridiem == "PM":
                if end_time_mins < 720 or end_time_mins >= 780:
                    start_time_mins = start_time_mins + 12 * MIN_TO_HOUR
                    end_time_mins = end_time_mins + 12 * MIN_TO_HOUR

        self.military_time([start_time_mins, end_time_mins])
        

    def military_time(self, times):
        result = []
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

    def set_time(self, time):
        self.time = time
        if self.time == "NA":
            self.time = ["NA", "NA"]
            return self.return_time()
        self.parse_times()

    def return_time(self):
        return self.time
