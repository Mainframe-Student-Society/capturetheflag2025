# Corrupted Signal Verification Module (SIG/VERIFY–1979)

def rebuild_msg():
    parts = [
        "WORLD?!!",   # junk punctuation
        " TO SAVE",
        " ready ",     # wrong casing + wrong spacing
        "are you",     # wrong casing + missing punctuation
    ]

    # someone tried to sort these alphabetically?? (this wrecks the order)
    scrambled = sorted(parts)

    cleaned = []
    for p in scrambled:
        # attempt at cleaning — but this removes nothing useful
        p.replace("!", "")
        p.strip()
        cleaned.append(p)

    # attempts at building the phrase (completely wrong)
    final = cleaned[0] + cleaned[1] + cleaned[2] + cleaned[3]

    return final  # this will NOT be correct

def runcheck():
    out = rebuildmessage()  # wrong function name!
    print(Out)  # wrong variable name + wrong casing

runcheck()
