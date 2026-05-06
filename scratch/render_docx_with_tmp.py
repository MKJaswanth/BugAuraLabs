import os
import runpy
import sys
import tempfile


os.makedirs(r"C:\tmp", exist_ok=True)
tempfile.tempdir = r"C:\tmp"

renderer = r"C:\Users\jaswa\.codex\plugins\cache\openai-primary-runtime\documents\26.426.12240\skills\documents\render_docx.py"
sys.argv = [
    renderer,
    r"C:\Users\jaswa\OneDrive\Documents\New project\output\C2C_Agri_Test_Case_Portfolio_Sample.docx",
    "--output_dir",
    r"C:\Users\jaswa\OneDrive\Documents\New project\output\c2c_agri_rendered",
    "--emit_pdf",
]
runpy.run_path(renderer, run_name="__main__")
