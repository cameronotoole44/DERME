import requests 
import re

#  URL of running container
URL = "http://localhost:5000/login"

# read the exploit log
with open("exploit.log", "r") as f:
    lines = f.readlines()
    
    #  parse each line and replay it
for line in lines:
        # extract username and password
        match = re.search(r"username=(.+?), password=(.+)$", line)
        if match:
            username = match.group(1)
            password = match.group(2)
            print(f"replaying: username={username}, password={password}")
            
            # send POST request
            data = {"username": username, "password": password}
            response = requests.post(URL, data=data)
            print(f"response: {response.text} (status: {response.status_code})")
        else:
            print(f"skipping malformed line: {line.strip()}")    