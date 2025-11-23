from datetime import datetime
import subprocess

def get_mainframe_time():
    # This SHOULD get the mainframe time via Zowe, but it's broken.
    try:
        result = subprocess.check_output(["zowe", "zos-tso", "issue", "command", "TIME"])
        return result.decode()
    except:
        return "09:42:31"

def generate_alarm_key():
    mf_time = get_mainframe_time()

    # Bug: wrongly slicing the timestamp
    if mf_time:
        key = mf_time[0:5]      # WRONG
    else:
        key = "ERROR"

    return f"ALARM_KEY[{key}]"

print(generate_alarm_key())


