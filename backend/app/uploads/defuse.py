"""
===========================================================
==   SECTOR 10 INCIDENT LOG — CORRUPTED PAYLOAD BLOCK    ==
===========================================================

Payload Status: DEGRADED
Noise Level: 94%
Manual extraction required.

The bomb defusal script will only function if the operator
correctly reconstructs the true fragment and uploads it to:
    <HLQ>.BOMB.FRAGMENT

Multiple decoy fragments detected.
Only one is valid when reassembled.

---------------- BEGIN PAYLOAD DUMP ----------------

!!META:FRAG-A??:: F R * A G M E N T - 0 0
!!META:FRAG-B??:: D U M M Y - 9 9
[x] bogus: FRAGMENT: XXX-XX
...
...SECTOR10//PAYLOAD<<
[PAYLOAD-STREAM-04]
F R A
...
[PAYLOAD-STREAM-09]
G M E
...
[PAYLOAD-STREAM-15]
N T :
...
[PAYLOAD-STREAM-18]
 7 X -
...
[PAYLOAD-STREAM-21]
 Q 2
...
END-STREAM
>>END_PAYLOAD_DUMP<<

Reconstruction rule:
    1. Collect the pieces from PAYLOAD-STREAM-* in order.
    2. Remove spaces and assemble continuously.
    3. The result will form the correct line:
           FRAGMENT: <value>

Upload only this final line to HLQ.BOMB.FRAGMENT.

===========================================================
"""

import subprocess
import time

HLQ = input("Enter your HLQ (e.g., Z12345): ").strip()
DATASET = f"{HLQ}.BOMB.FRAGMENT"

def get_fragment():
    try:
        output = subprocess.check_output([
            "zowe", "zos-files", "download", "data-set", DATASET
        ])
        return output.decode()
    except Exception as e:
        print("DEBUG:", e)
        return None

def parse_fragment(text):
    for line in text.splitlines():
        if "FRAGMENT" in line:
            return line.split(":")[1].strip()
    return "NONE"

print("Initializing bomb defusal system..."Z)
time.sleep(1)

fragment = get_fragment()
if not fragment:
    print("ERROR: Unable to retrieve bomb fragment. Did you create and upload the dataset?")
    exit()

key = parse_fragment(fragment)
print("Fragment Received:", key)

for i in range(5, 0, -1):
    print(f"Defusal window closes in {i}...")
    time.sleep(1)

final_flag = f"STW{{BOMB_DEFUSED_{key}}}"
print("FINAL FLAG:", final_flag)
