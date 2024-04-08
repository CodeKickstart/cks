import os
import subprocess
from pathlib import Path

cmd = '__x1.bat'
cwd = str( Path( __file__ ).parent )

cmd_path = os.path.join(cwd, cmd)
sp = subprocess.Popen(
    cmd_path,
    shell=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    universal_newlines=True
)

rc = sp.wait()
out, err = sp.communicate()

print( '*** Return Code:', rc, '\n' )
print( '*** output is: \n', out )
print( '*** error is: \n', err )
x = 1
