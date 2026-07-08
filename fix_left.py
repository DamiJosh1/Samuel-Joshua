with open("src/pages/AdminDashboard.tsx", "r") as f:
    lines = f.readlines()

insert_idx = 0
for i, line in enumerate(lines):
    if "{selectedAppId && selectedUserEmail && (" in line:
        insert_idx = i
        break

new_lines = lines[:insert_idx] + [
    "            </div>\n",
    "          )}\n",
    "          </div>\n"
] + lines[insert_idx:]

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.writelines(new_lines)
