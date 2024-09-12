import requests
import subprocess
import json
import os
import mido
from mido import MidiFile

# Global variables to hold the selected .dat URL and key
selected_dat_url = None
selected_key = None

# Load the JSON data from the URL
response = requests.get("https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/spark-tracks")
data = response.json()

# Function to replace track names in a MIDI file
def replace_tracks_in_midi(midi_file):
    try:
        # Load the MIDI file
        mid = MidiFile(midi_file)
        
        # Print out track names for debugging
        for track in mid.tracks:
            print(f"Original track name: {track.name}")

        # Rename tracks
        for track in mid.tracks:
            for msg in track:
                if msg.type == 'track_name':
                    if 'PART GUITAR' in msg.name:
                        msg.name = 'PART GUITAR_FNF'
                    elif 'PLASTIC GUITAR' in msg.name:
                        msg.name = 'PART GUITAR'
                    elif 'PART BASS' in msg.name:
                        msg.name = 'PART BASS_FNF'
                    elif 'PLASTIC BASS' in msg.name:
                        msg.name = 'PART BASS'
        
        # Save the updated MIDI file
        mid.save(midi_file)
        print(f"Updated tracks in MIDI file {midi_file}")

    except Exception as e:
        print(f"Error while renaming tracks in MIDI file: {e}")

# Function to download and decrypt the .dat file, rename the .mid file, and delete the .dat file
def download_and_decrypt_dat():
    if selected_dat_url and selected_key:
        # Download the .dat file
        dat_file = selected_dat_url.split("/")[-1]  # Extract the filename from the URL
        response = requests.get(selected_dat_url)
        
        # Save the .dat file
        with open(dat_file, 'wb') as f:
            f.write(response.content)
        
        # Run the decryption script
        try:
            subprocess.run(['python3', 'fnf-midcrypt.py', '-d', dat_file], check=True)
            print(f"Decrypted {dat_file} successfully!")
            
            # Rename the resulting .mid file to match the selected key
            original_mid_file = dat_file.replace('.dat', '.mid')
            renamed_mid_file = f"{selected_key}.mid"
            
            if os.path.exists(original_mid_file):
                os.rename(original_mid_file, renamed_mid_file)
                print(f"Renamed {original_mid_file} to {renamed_mid_file}")
                
                # Create a folder named after the .mid file (without extension)
                folder_name = f"{selected_key}"
                os.makedirs(folder_name, exist_ok=True)
                
                # Move the .mid file to the new folder
                moved_mid_file = os.path.join(folder_name, renamed_mid_file)
                os.rename(renamed_mid_file, moved_mid_file)
                print(f"Moved {renamed_mid_file} to folder {folder_name}")

                # Process the moved .mid file to update track names
                replace_tracks_in_midi(moved_mid_file)

                # Save the 'tt' and 'an' values to a .yml file with prefixes
                track_info = data[selected_key].get('track', {})
                track_title = track_info.get('tt', 'Unknown Title')
                artist_name = track_info.get('an', 'Unknown Artist')
                yml_filename = os.path.join(folder_name, "song.yml")
                
                with open(yml_filename, 'w') as yml_file:
                    yml_file.write(f"title: {track_title}\n")
                    yml_file.write(f"artist: {artist_name}\n")
                    yml_file.write(f"charter: Harmonix, Rhythm Authors\n")
                print(f"Saved track title, artist, and charter to {yml_filename}")

                # Delete the .dat file
                os.remove(dat_file)
                print(f"Deleted {dat_file}")
            else:
                print(f"Error: {original_mid_file} not found after decryption.")
        
        except subprocess.CalledProcessError as e:
            print(f"Error while decrypting {dat_file}: {e}")

# Function to process all tracks
def download_all_tracks():
    for key in data:
        if isinstance(data[key], dict) and "track" in data[key]:
            track_info = data[key].get('track', {})
            if 'mu' in track_info:
                global selected_dat_url, selected_key
                selected_key = key
                selected_dat_url = track_info['mu']
                download_and_decrypt_dat()

# Run the download and decryption for all tracks immediately when the script is executed
download_all_tracks()