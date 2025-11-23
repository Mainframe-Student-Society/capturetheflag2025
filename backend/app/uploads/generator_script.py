# --- CONFIGURATION ---
SECRET_PHRASE = "BDDFTT_HSBOUFE_SBDF_300" 
# ---------------------

def generate_access_code():
    """
    Generates an access code by applying a decryption shift to the secret phrase.
    """
    
    shift = 4
    
    
    decoded_code = ""
    for char in SECRET_PHRASE:
        if 'A' <= char <= 'Z':
            
            base = ord('A')
            shifted_char_index = ord(char) - base
            
            decrypted_index = (shifted_char_index - shift) % 26 
            
            decoded_code += chr(base + decrypted_index)
        else:
            decoded_code += char
            
    print(f"--- Access Code Generator Report ---")
    print(f"Fixed Shift Used: {shift}")
    print(f"---")
    print(f"Outputted Vault Code: {decoded_code}")
    print(f"---")
    
if __name__ == "__main__":
    generate_access_code()