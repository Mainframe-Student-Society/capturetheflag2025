## JCL_SIMULATOR.PY

SECRET_PARTS = [
    "JAY",
    "BYE",
    "SEE",
    "DEE",
    "HELL",
    "FIVE",
    "SIXX",
    "SEVEN",
    "EIGHT"
]

def execute_step(step_name, rc_val):
    print(f"--- EXECUTE {step_name} ---")
    
    print(f"RC: {rc_val}")
    
    try:
        secret_segment = SECRET_PARTS[rc_val]
        print(f"DATA: '{secret_segment}'")
        return rc_val, secret_segment
    except IndexError:
        print("ERROR: RC value is too high for data extraction.")
        return rc_val, "[FAIL]"


def run_jcl_job():
    
    final_rc = 0
    secret_submission = []
    
    step1_rc, step1_segment = execute_step("STEP01_INIT", 0)
    final_rc = max(final_rc, step1_rc)
    secret_submission.append(step1_segment)
    print("-" * 20)

    buggy_rc = 8
    step2_rc, step2_segment = execute_step("STEP02_PROCESS", buggy_rc)
    final_rc = max(final_rc, step2_rc)
    secret_submission.append(step2_segment)
    print("-" * 20)
    
    step3_rc, step3_segment = execute_step("STEP03_REPORT", 4)
    final_rc = max(final_rc, step3_rc)
    secret_submission.append(step3_segment)
    print("-" * 20)

    final_secret = " ".join(secret_submission)
    
    print(f"JCL JOB ENDED - FINAL RETURN CODE: {final_rc}")
    print(f"ASSEMBLED SECRET: {final_secret}")
    return final_secret

if __name__ == "__main__":
    run_jcl_job()