# Open and read the contents of input.txt
with open("input.txt", "r", encoding="utf-8") as infile:
    content = infile.read()

# Remove all newline characters
content_no_newlines = content.replace('-\n', ' ')
content_no_newlines = content_no_newlines.replace('\n', ' ')

# Write the modified content to output.txt
with open("output.txt", "w", encoding="utf-8") as outfile:
    outfile.write(content_no_newlines)

print("All newline characters have been removed and saved to output.txt.")
