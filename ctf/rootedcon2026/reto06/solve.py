import sys

def run_cow(source_code):
    # Instructions map
    # moo: 0 - End loop
    # mOo: 1 - Move ptr back
    # moO: 2 - Move ptr forward
    # mOO: 3 - Execute value in memory as instruction
    # Moo: 4 - Read char (if mem==0) else print char
    # MOo: 5 - Decrement
    # MoO: 6 - Increment
    # MOO: 7 - Start loop
    # OOO: 8 - Set to 0
    # MMM: 9 - Copy to/from register
    # OOM: 10 - Print int
    # oom: 11 - Read int
    
    # Filtering only valid COW instructions
    valid_insts = ["moo", "mOo", "moO", "mOO", "Moo", "MOo", "MoO", "MOO", "OOO", "MMM", "OOM", "oom"]
    instructions = []
    
    # Chunk by 3
    i = 0
    while i < len(source_code) - 2:
        chunk = source_code[i:i+3]
        if chunk in valid_insts:
            instructions.append(chunk)
            i += 3
        else:
            i += 1 # Skip invalid chars

    memory = [0] * 5000
    ptr = 0
    reg = None
    pc = 0
    
    # Pre-compute jumps
    jumps = {}
    stack = []
    
    for idx, inst in enumerate(instructions):
        if inst == 'MOO':
            stack.append(idx)
        elif inst == 'moo':
            if stack:
                start = stack.pop()
                jumps[start] = idx
                jumps[idx] = start
            else:
                # Unmatched moo - typically ignore or error, but let's assume valid code
                pass

    while pc < len(instructions):
        inst = instructions[pc]
        
        if inst == 'moo':
            # End of loop: go back to matching MOO
            # But only if it was a loop start match.
            if pc in jumps:
                pc = jumps[pc] - 1 # Will increment at end of loop
            else:
                pass # Just pass through
                
        elif inst == 'mOo':
            ptr -= 1
            if ptr < 0: ptr = 0
            
        elif inst == 'moO':
            ptr += 1
            if ptr >= len(memory): memory.extend([0] * 1000)
            
        elif inst == 'MOo':
            memory[ptr] -= 1
            
        elif inst == 'MoO':
            memory[ptr] += 1
            
        elif inst == 'MOO':
            # Start of loop
            if memory[ptr] == 0:
                # Skip to end
                if pc in jumps:
                    pc = jumps[pc]
                else:
                    # Should not happen in valid code
                    break
            else:
                # Enter loop
                pass
                
        elif inst == 'OOO':
            memory[ptr] = 0
            
        elif inst == 'MMM':
            if reg is None:
                reg = memory[ptr]
            else:
                memory[ptr] = reg
                reg = None
                
        elif inst == 'OOM':
            print(memory[ptr], end='')
            
        elif inst == 'oom': # Should be print char? Or read?
            # 'oom' is usually print char in some dialects, 'Moo' is read.
            # Let's check spec:
            # Moo: If 0, read char. If not 0, print char.
            # oom: Print integer?
            # OOM: Print char?
            # It's confusing. Let's assume standard COW:
            # Moo: if mem[ptr]==0: read() else: print(chr(mem[ptr]))
            pass

        # Standard COW mapping:
        # moo: loop end
        # mOo: ptr--
        # moO: ptr++
        # mOO: exec
        # Moo: if 0: read() else: print(chr)
        # MOo: val--
        # MoO: val++
        # MOO: loop start
        # OOO: val=0
        # MMM: register
        # OOM: print(int)
        # oom: print(int)? No, usually not used.
        
        # In the provided text, we see 'oom' and 'OOM' and 'MMM'.
        # Let's follow a common Python interpreter logic:
        # Moo: print char (if non-zero)
        
        if inst == 'Moo':
            if memory[ptr] != 0:
                print(chr(memory[ptr]), end='')
            else:
                # Read char - ignore for CTF
                pass
                
        pc += 1

if __name__ == "__main__":
    with open("data/raw/rootedcon26/reto06/Muuuuu.txt", "r") as f:
        content = f.read().replace('\n', '').replace(' ', '')
        # Basic cleanup of non-cow chars
        cleaned = ""
        valid_chars = "moOM"
        for c in content:
            if c in valid_chars:
                cleaned += c
        run_cow(cleaned)
        print()
