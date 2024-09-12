#!/bin/bash

# Specify the full path to the onyx command
onyx_command="/Applications/Onyx-Latest/Onyx.app/Contents/MacOS/onyx"
rm -rf paths
rm final_output.txt

#!/bin/bash




# Store the original directory
original_dir=$(pwd)

# Specify the parent directory to search for RB2CON files
parent_directory="."

# Loop through each subdirectory (excluding hidden directories)
for dir in "$parent_directory"/*/; do
    # Check if the directory contains a song.yml file
    if [ -f "$dir/song.yml" ]; then
        echo "Processing directory: $dir"

        # Extract title and artist from song.yml
        title=$(awk '/^ *title:/{gsub(/^ *title: /, ""); print}' "$dir/song.yml")
        artist=$(awk '/^ *artist:/{gsub(/^ *artist: /, ""); print}' "$dir/song.yml")

        shortname=$(basename "$dir")


        # Create the output string in the desired format
        title_artist="$title by $artist"

        # Save the formatted output to a text file in the same directory
        echo "$title_artist" > "$dir/songtitle.txt"

        echo "Extracted and saved: $title_artist"
        echo "-------------------------------------"

        # Create song.ini file
        echo "[song]" > "$dir/song.ini"
        echo "name = $title" >> "$dir/song.ini"
        echo "artist = $artist" >> "$dir/song.ini"
        echo "charter = Harmonix, Rhythm Authors" >> "$dir/song.ini"

        # Change directory to process subdirectory files
        cd "$dir" || continue

        # Read entire contents of songtitle.txt into title_artist
        title_artist=$(<songtitle.txt)

        # Create the clean title_artist string
        clean_title_artist=$(echo "$title_artist" | iconv -f utf-8 -t ascii//TRANSLIT | sed -e 's/[^[:alnum:]?[:space:]]//g' -e 's/ /_/g' | tr '[:upper:]' '[:lower:]')

        # Guitar output file name
        guitar_output="${clean_title_artist}_guitar.png"
        # Bass output file name
        bass_output="${clean_title_artist}_bass.png"

        # Assign the Guitar path output of CHOpt command to the variable $guitar_path
        guitar_path=$( scripts/fnf_chopt -f *.mid --lazy 1000000 --early-whammy 0 --no-image --engine rb  | \
        grep -v "Optimising" | \
        sed -e 's/ ([^(]*)//g' | \
        awk '/^Total score:/ {next} !/^Path:|^No SP score:/ {gsub(/: /, "/", $0); gsub(/: /, ",", $0); gsub("/ ", "/", $0); if (NR > 1 && items) printf ", "; printf "%s", $0; items=1} END {if (NR > 0) printf "\n"}' )

        # Set guitar image path variable
        guitar_path_image="'$guitar_output'"

        # Guitar Score
        guitar_score=$( scripts/CHOpt -f *.mid --early-whammy 0 --engine fnf -o "$guitar_output" | \
        awk '/^Total score:/ {print $NF; exit}' )

        # Assign the Bass path output of CHOpt command to the variable $bass_path
        bass_path=$( scripts/fnf_chopt -f *.mid -i bass --lazy 100000 --no-image --early-whammy 0 --engine rb -o "$bass_output" | \
        grep -v "Optimising" | \
        sed -e 's/ ([^(]*)//g' | \
        awk '/^Total score:/ {next} !/^Path:|^No SP score:/ {gsub(/: /, "/", $0); gsub(/: /, ",", $0); gsub("/ ", "/", $0); if (NR > 1 && items) printf ", "; printf "%s", $0; items=1} END {if (NR > 0) printf "\n"}' )

        # Set bass image path variable
        bass_path_image="'$bass_output'"

        # Bass Score
        bass_score=$( scripts/CHOpt -f *.mid -i bass --early-whammy 0 --engine fnf -o "$bass_output" | \
        awk '/^Total score:/ {print $NF; exit}' )

        # Guitar Gold Stars Cutoff
        guitar_goldstars=$(echo "$g_guitarstars=$(/Applications/Onyx.app/Contents/MacOS/onyx scoring *.mid G x)" | grep -o 'starsGold = .*' | sed -e 's/starsGold = //' -e 's/Just//g' -e 's/}//g' -e ':a' -e 's/\B\([0-9]\{3\}\)\>/,\1/;ta')

        # Bass Gold Stars Cutoff
        bass_goldstars=$(echo "$b_guitarstars=$(/Applications/Onyx.app/Contents/MacOS/onyx scoring *.mid B x)" | grep -o 'starsGold = .*' | sed -e 's/starsGold = //' -e 's/Just//g' -e 's/}//g' -e ':a' -e 's/\B\([0-9]\{3\}\)\>/,\1/;ta')

        # Export the template using the $path and $title variables
        template='{ value : "'"$title_artist"'", 
            data : {
            spotNote : "",
            taps : "False",
            bre : "False",
            vpath : "",
            vnote : "",
            vvid : "",
            vbnote : "",
            hpath : "",
            hnote : "",
            hvid : "",
            dpath : "'"$drums_path"'",
            dnote : "",
            dscore :  "'"$drums_path"'",
            dvid : "",
            gpath : "'"$guitar_path"'",
            gnote : "",
            gscore : "'"$guitar_score"'",
            g_gs : "'"$guitar_goldstars"'",
            g_image : "'"${guitar_path_image}"'",
            gvid : "",
            bpath : "'"$bass_path"'",
            bnote : "",
            bscore : "'"$bass_score"'",
            b_gs : "'"$bass_goldstars"'",
            bvid : "",
            b_image : "'"$bass_path_image"'",
            shortname : "'"$shortname"'",
        }}'

        # Add an extra comma at the end of the template
        template="$template,"

        # Append the template to the array
        templates+=("$template")

        # Echo progress
        echo "$title_artist path saved"

        # Save the template to a file in the original directory
        echo "$template" >> "$original_dir"/final_output.txt

        # Return to the original directory
        cd "$original_dir" || exit
    fi
done

# Specify the parent directory to search for PNG files
parent_directory="."

# Specify the directory to move PNG files into
paths_directory="$parent_directory/paths"
mkdir -p "$paths_directory"  # Create 'paths' directory if it doesn't exist

# Move all .png files to the 'paths' directory
echo "Moving .png files to 'paths' directory..."
find "$parent_directory" -type f -name "*.png" -exec mv {} "$paths_directory" \;
echo "All .png files moved to 'paths' directory: $paths_directory"

# Remove directories ending with _import
echo "Removing directories ending with '_import'..."
find "$parent_directory" -type d -name "*_import" -exec rm -rf {} +
echo "Directories ending with '_import' removed."
