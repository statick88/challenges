import numpy as np
from scipy.io import wavfile

def detect_morse(file_path):
    rate, data = wavfile.read(file_path)
    if len(data.shape) > 1:
        data = data[:, 0]
    
    # Normalize
    data = np.abs(data)
    data = data / np.max(data)
    
    # Thresholding
    threshold = 0.2
    binary = (data > threshold).astype(np.int8)
    
    # Analyze pulse lengths
    diff = np.diff(binary)
    starts = np.where(diff == 1)[0]
    ends = np.where(diff == -1)[0]
    
    if len(ends) < len(starts):
        starts = starts[:len(ends)]
    
    lengths = (ends - starts) / rate
    print(f"Detected {len(lengths)} pulses.")
    
    # Categorize as dot or dash
    if len(lengths) > 0:
        dot_len = np.min(lengths)
        dash_len = np.max(lengths)
        mid = (dot_len + dash_len) / 2
        
        morse = ""
        for l in lengths:
            if l > mid: morse += "-"
            else: morse += "."
        print(f"Morse: {morse}")

if __name__ == "__main__":
    detect_morse("data/raw/rootedcon26/reto13/TresRatonesCiegos.wav")
