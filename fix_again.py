with open("src/pages/AdminDashboard.tsx", "r") as f:
    lines = f.readlines()

new_lines = lines[:2116] + [
    "            </div>\n",
    "          )}\n",
    "        </div>\n",
    "      )}\n",
    "    </main>\n",
    "  );\n",
    "}\n"
]

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.writelines(new_lines)
