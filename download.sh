#!/bin/bash
URL=https://www.nseindia.com/content/historical/EQUITIES/2018/MAR/cm09MAR2018bhav.csv.zip
user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"
echo "Enter the date to download Bhavcopy (Format: DD-MON-YYYY ex: 01MAR2018)"
read date
echo "Entered Date: " $date;
pre_URL=https://www.nseindia.com/content/historical/EQUITIES/2018/MAR/cm
suf_URL=bhav.csv.zip
URL=$pre_URL$date$suf_URL
fileName=cm$date
fileName+=bhav.csv
echo "Downloading..."
wget -U $user-agent $URL && gunzip -c > $fileName
echo "Extracting to: " $fileName
unzip $fileName.zip
rm $fileName.zip
node daily_update_bhavcopy.js --date=$date;