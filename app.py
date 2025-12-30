import streamlit as st
import os
import zipfile
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from docx import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from streamlit.components.v1 import html

load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("gemini")

st.set_page_config(
    page_title="AI Portfolio Generator",
    page_icon="🌐",
    layout="wide"
)

st.markdown("""
<h1 style="text-align:center;">🧠 AI-Generated Portfolio Website</h1>
<p style="text-align:center; font-size:18px;">
Upload your resume and get a professional portfolio website instantly
</p>
""", unsafe_allow_html=True)

def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file):
    doc = Document(file)
    return "\n".join([para.text for para in doc.paragraphs])

def generate_website_prompt(resume_text):
    prompt = f"""
    You are an AI resume analyzer.
    From the following resume text, extract structured details and generate
    a professional portfolio website specification.

    Extract:
    - Name
    - Professional summary
    - Skills
    - Experience
    - Projects
    - Education
    - Achievements
    - Preferred design style
    - Languages

    Resume:
    {resume_text}
    """
    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
    response = model.invoke(prompt)
    return response.content

def generate_website_code(website_prompt):
    system_message = """
    You are an expert frontend web developer.
    Generate a modern, responsive portfolio website.

    Output strictly in this format:

    --html--
    [html code]
    --html--

    --css--
    [css code]
    --css--

    --js--
    [javascript code]
    --js--
    """
    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash",temperature=0.6)
    response = model.invoke([
        ("system", system_message),
        ("user", website_prompt)
    ])

    content = response.content
    html_code = content.split("--html--")[1].strip()
    css_code = content.split("--css--")[1].strip()
    js_code = content.split("--js--")[1].strip()

    return html_code, css_code, js_code

def create_zip():
    with zipfile.ZipFile("portfolio_website.zip", "w") as zipf:
        zipf.write("index.html")
        zipf.write("style.css")
        zipf.write("script.js")

st.markdown("### 📄 Upload Resume (PDF or DOCX)")

uploaded_file = st.file_uploader(
    "Choose your resume",
    type=["pdf", "docx"]
)
if uploaded_file:
    with st.spinner("Extracting resume content..."):
        if uploaded_file.type == "application/pdf":
            resume_text = extract_text_from_pdf(uploaded_file)
        else:
            resume_text = extract_text_from_docx(uploaded_file)

    st.success("Resume extracted successfully")

    with st.spinner(" Generating website specification..."):
        website_prompt = generate_website_prompt(resume_text)

    with st.spinner(" Generating portfolio website..."):
        html_code, css_code, js_code = generate_website_code(website_prompt)

        with open("index.html", "w", encoding="utf-8") as f:
            f.write(html_code)

        with open("style.css", "w", encoding="utf-8") as f:
            f.write(css_code)

        with open("script.js", "w", encoding="utf-8") as f:
            f.write(js_code)

        create_zip()

    st.success(" Portfolio Website Generated Successfully!")

    st.download_button(
        " Download Website ZIP",
        data=open("portfolio_website.zip", "rb"),
        file_name="portfolio_website.zip",
        use_container_width=True
    )
