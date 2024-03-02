import random
import string

def get_otp():
    # Select 4 random numbers between 1 and 9
    numbers = [random.randint(1, 9) for _ in range(4)]
    
    # Select 4 random letters between 'a' and 'z'
    letters = [random.choice(string.ascii_lowercase) for _ in range(4)]
    
    # Combine the numbers and letters
    code = numbers + letters
    
    # Shuffle the combined list to randomize the order
    random.shuffle(code)
    
    # Convert the list to a string
    code_string = ''.join(str(item) for item in code)
    
    return code_string.upper()