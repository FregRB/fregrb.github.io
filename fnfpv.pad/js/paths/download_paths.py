import requests
import os

# List of filenames to download
filenames = [
    "allthesmallthings.100.png",
    "bullsonparade.100.png",
    "dragula.100.png",
    "entersandman.100.png",
    "hailtotheking.100.png",
    "lovinonme.100.png",
    "nothingelsematters.100.png",
    "rubysoho.100.png",
    "sabotage.100.png",
    "santeria.100.png",
    "scenario.100.png",
    "sexyandiknowit.100.png",
    "surroundsound.100.png",
    "thisishowwedoit.100.png",
    "whereverimayroam.100.png"
]

# List of base URLs and corresponding instrument parts
base_urls = [
    ("https://media.gmscorner.dev/fortnite/expert/drums/", "drums"),
    ("https://media.gmscorner.dev/fortnite/expert/guitar/", "guitar"),
    ("https://media.gmscorner.dev/fortnite/expert/bass/", "bass"),
    ("https://media.gmscorner.dev/fortnite/expert/vocals/", "vocals")
]

# Download each file from each base URL
for base_url, instrument in base_urls:
    for filename in filenames:
        # Replace .100 in the filename with the instrument part
        new_filename = filename.replace(".100", f"_{instrument}")
        url = base_url + filename
        
        # Make the request to download the file
        response = requests.get(url)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Save the file
            with open(new_filename, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded {new_filename} from {base_url}")
        else:
            print(f"Failed to download {filename} from {base_url}")

print("All downloads completed!")