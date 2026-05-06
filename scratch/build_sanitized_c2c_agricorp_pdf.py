from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


OUT = r"C:\Users\jaswa\OneDrive\Documents\New project\output\C2C_Agri_Sanitized_QA_Document.pdf"


GREEN = colors.HexColor("#2F6B3F")
DEEP_GREEN = colors.HexColor("#1F5130")
LIGHT_GREEN = colors.HexColor("#EAF4EC")
PALE = colors.HexColor("#F8FBF8")
DARK = colors.HexColor("#1F2933")
MUTED = colors.HexColor("#667085")
BORDER = colors.HexColor("#D7E4D9")
AMBER = colors.HexColor("#FFF4D6")
BLUE = colors.HexColor("#285E8E")
RED = colors.HexColor("#B42318")
ORANGE = colors.HexColor("#B54708")
GRAY = colors.HexColor("#EEF2F4")


styles = getSampleStyleSheet()
styles.add(ParagraphStyle("CoverTitle", fontName="Helvetica-Bold", fontSize=22, textColor=GREEN, alignment=TA_CENTER, leading=27, spaceAfter=8))
styles.add(ParagraphStyle("CoverSub", fontName="Helvetica", fontSize=11.5, textColor=DARK, alignment=TA_CENTER, leading=16, spaceAfter=18))
styles.add(ParagraphStyle("H1x", fontName="Helvetica-Bold", fontSize=14, textColor=GREEN, leading=18, spaceBefore=10, spaceAfter=7))
styles.add(ParagraphStyle("H2x", fontName="Helvetica-Bold", fontSize=10.5, textColor=DARK, leading=13, spaceBefore=7, spaceAfter=4))
styles.add(ParagraphStyle("Bodyx", fontName="Helvetica", fontSize=8.4, textColor=DARK, leading=10.5, spaceAfter=4))
styles.add(ParagraphStyle("Tiny", fontName="Helvetica", fontSize=6.8, textColor=DARK, leading=8.2))
styles.add(ParagraphStyle("TinyBold", fontName="Helvetica-Bold", fontSize=6.8, textColor=DARK, leading=8.2))
styles.add(ParagraphStyle("Cell", fontName="Helvetica", fontSize=6.7, textColor=DARK, leading=8.1))
styles.add(ParagraphStyle("CellBold", fontName="Helvetica-Bold", fontSize=6.7, textColor=DARK, leading=8.1))
styles.add(ParagraphStyle("HeaderCell", fontName="Helvetica-Bold", fontSize=6.5, textColor=colors.white, leading=7.7, alignment=TA_CENTER))
styles.add(ParagraphStyle("Callout", fontName="Helvetica", fontSize=8.2, textColor=DARK, leading=10.2))


def clean(text):
    if text is None:
        return ""
    replacements = {
        "C2C Agricorp India": "C2C Agri Marketplace",
        "https://c2cagricorpindia.com/": "[Website URL Removed]",
        "https://c2cagricorpindia.com": "[Website URL Removed]",
        "Jaswanth M": "QA Tester",
        "test@gmail.com": "[Sample Email Removed]",
        "Test@gmail.com": "[Sample Email Removed]",
        "info@yourcompany.example.com": "[Email Removed]",
        "+1 555-555-5556": "[Phone Removed]",
        "3575 Fake Buena Vista Avenue": "[Address Removed]",
        "My Company": "[Company Name Removed]",
        "real address, phone, email": "approved company details",
    }
    value = str(text)
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value.replace("\n", "<br/>").replace("\r", "<br/>")


def p(text, style="Bodyx"):
    return Paragraph(clean(text), styles[style])


test_cases = [
    ["TC_001", "Homepage", "Verify homepage loads successfully", "Open browser; navigate to site.", "Page loads within 3 sec with all elements visible", "Page loaded within 3 sec with all elements visible", "Pass", "High", "Minor", ""],
    ["TC_002", "Homepage", "Verify phone number and email in header are clickable hyperlinks", "Open homepage; locate phone and email; click both contact items.", "Phone opens dialer; email opens mail client", "Both are static text with no link behavior", "Pass", "Medium", "Minor", "BUG_001"],
    ["TC_003", "Navigation", "Verify all nav menu links work", "Click each menu item and verify correct page opens.", "Each link navigates to correct page", "Each link navigates to the correct page", "Pass", "High", "Minor", ""],
    ["TC_004", "Homepage", "Verify cart page is not accessible without login", "Open site as guest; click CART icon; observe page behavior.", "Redirect to login or show login prompt", "Cart page loads without authentication and displays empty cart state", "Fail", "Medium", "Minor", "BUG_002"],
    ["TC_005", "Enquiry Form", "Verify name field rejects numeric input", "Enter numeric/mixed values in first and last name fields; submit.", "Name field should show alphabet-only validation error", "Numbers are accepted without validation error", "Pass", "High", "Minor", "BUG_003"],
    ["TC_006", "Home Page Banner", "Verify Wholesale Solution button navigation", "Open homepage banner and click Wholesale Solution button.", "User should be redirected to Wholesale Solutions page", "User is redirected to About Us page instead", "Pass", "High", "Minor", "BUG_004"],
    ["TC_007", "Product Section", "Verify product links under What We Export section", "Scroll to export products and click any product.", "User should open valid product/category detail page", "User is redirected to 404 Page Not Found", "Pass", "High", "Minor", "BUG_005"],
    ["TC_008", "Product Carousel", "Verify carousel navigation arrows", "Click forward and backward carousel arrows.", "Carousel should move to next/previous products", "Carousel remains static", "Pass", "High", "Minor", "BUG_006"],
    ["TC_009", "Export Products", "Verify correct product mapping", "Click product and compare selected product with detail page.", "Product details should match selected product", "Displayed product details do not match selection", "Fail", "High", "Minor", "BUG_007"],
    ["TC_010", "Seasonal Products", "Verify seasonal product navigation and availability", "Click seasonal item and check redirected product page.", "Relevant products should be displayed", "Page loads but no products are shown", "Pass", "High", "Minor", "BUG_008"],
    ["TC_011", "Map Section", "Verify transportation path alignment on map", "Scroll to map section and compare route line with markers.", "Route should align with map markers", "Route line appears misaligned", "Pass", "Low", "Minor", "BUG_009"],
    ["TC_012", "Wholesale Hub", "Verify login persistence from homepage dashboard link", "Log in; navigate homepage; click Login Dashboard.", "User should open dashboard without logging in again", "User is redirected to login page again", "Pass", "High", "Minor", "BUG_010"],
    ["TC_013", "Testimonials", "Verify testimonial carousel navigation arrows", "Click forward and backward testimonial arrows.", "Testimonials should change on navigation", "Testimonials remain static", "Pass", "Low", "Minor", "BUG_011"],
    ["TC_014", "Knowledge Hub", "Verify article navigation", "Click any Knowledge Hub article/post.", "User opens corresponding article/detail page", "User is redirected to correct page", "Pass", "High", "Minor", ""],
    ["TC_015", "Authentication", "Verify login behavior when already authenticated", "Log in; observe profile state; click Login in header.", "Show dashboard/profile or account options", "Login page opens again despite active session", "Pass", "High", "Major", "BUG_012"],
    ["TC_016", "Newsletter", "Verify newsletter subscription by button and Enter key", "Enter sample email; click Subscribe; repeat using Enter.", "Show success/error message without unnecessary reload", "Button does nothing; Enter reloads page", "Fail", "Low", "Minor", "BUG_013"],
    ["TC_017", "Header Menu", "Verify Our Process dropdown behavior", "Hover and click Our Process menu item.", "Dropdown should open on hover or click as designed", "Dropdown opens only on click", "Pass", "Low", "Major", "BUG_014"],
    ["TC_018", "Process Flow", "Verify process-flow performance and connector alignment", "Open process page; observe loading and connector lines.", "Page loads smoothly and connectors align", "Page feels laggy; connector lines misaligned", "Pass", "Low", "Minor", "BUG_014"],
    ["TC_019", "Contact Form", "Verify Name field validation", "Enter numeric values in Name field and submit.", "Numeric input should be blocked with validation", "Numeric input is accepted", "Pass", "Low", "Major", "BUG_015"],
    ["TC_020", "Contact Form", "Verify Thank You page company information", "Submit contact form and inspect Thank You page.", "Thank You page should show approved company details", "Page displays placeholder company, address, phone, and email", "Fail", "High", "Minor", "BUG_016"],
]

bug_reports = [
    ["BUG_001", "TC_002", "Homepage", "Phone number and email in header are not clickable hyperlinks", "Minor", "Medium", "Open", "Dev Team"],
    ["BUG_002", "TC_004", "Homepage", "Cart page accessible without user login", "Major", "High", "Open", "Dev Team"],
    ["BUG_003", "TC_005", "Enquiry Form", "First Name field accepts numeric and special characters", "Minor", "High", "Open", "Dev Team"],
    ["BUG_004", "TC_006", "Home Page Banner", "Wholesale Solution button redirects to incorrect page", "Minor", "Medium", "Open", "Dev Team"],
    ["BUG_005", "TC_007", "Product Section", "Product links lead to 404 Page", "Major", "High", "Open", "Dev Team"],
    ["BUG_006", "TC_008", "Product Carousel", "Carousel navigation buttons not functioning", "Minor", "Medium", "Open", "Dev Team"],
    ["BUG_007", "TC_009", "Export Products", "Product cards open incorrect product detail pages", "Major", "High", "Open", "Dev Team"],
    ["BUG_008", "TC_010", "Seasonal Products", "Seasonal links redirect to empty product pages", "Major", "Medium", "Open", "Dev Team"],
    ["BUG_009", "TC_011", "Map Section", "Transport route line is misaligned on map", "Major", "Low", "Open", "Dev Team"],
    ["BUG_010", "TC_012", "Wholesale Hub", "Logged-in user is prompted to log in again", "Major", "Medium", "Open", "Dev Team"],
    ["BUG_011", "TC_013", "Testimonials", "Testimonial carousel arrows not functioning", "Minor", "Low", "Open", "Dev Team"],
    ["BUG_012", "TC_015", "Authentication", "Active user is sent to login page again", "Major", "Medium", "Open", "Dev Team"],
    ["BUG_013", "TC_016", "Newsletter", "Subscribe button non-functional; Enter reloads page", "Minor", "Low", "Open", "Dev Team"],
    ["BUG_014", "TC_017", "Header Menu", "Our Process dropdown does not open on hover", "Minor", "Low", "Open", "Dev Team"],
    ["BUG_015", "TC_018", "Process Flow", "Process page lag and connector misalignment", "Minor", "Low", "Open", "Dev Team"],
    ["BUG_016", "TC_019", "Contact Form", "Name field accepts numeric values", "Minor", "Low", "Open", "Dev Team"],
    ["BUG_017", "TC_020", "Contact Form", "Thank You page displays placeholder company details", "Minor", "Low", "Open", "Dev Team"],
]


def footer(canvas, doc):
    canvas.saveState()
    page_width, page_height = doc.pagesize
    canvas.setFillColor(GREEN)
    canvas.rect(0, page_height - 8 * mm, page_width, 8 * mm, fill=1, stroke=0)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(page_width / 2, 9 * mm, "C2C Agri Marketplace | QA Test Cases and Bug Report Portfolio Sample")
    canvas.drawRightString(page_width - 14 * mm, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


def make_table(rows, widths, header=True):
    table_data = []
    for r_idx, row in enumerate(rows):
        style = "HeaderCell" if header and r_idx == 0 else "Cell"
        table_data.append([p(cell, style) for cell in row])
    tbl = Table(table_data, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), GREEN if header else colors.white),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white if header else DARK),
        ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 3.5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3.5),
        ("TOPPADDING", (0, 0), (-1, -1), 3.2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
    ]))
    return tbl


def status_color(value):
    text = str(value).lower()
    if text == "pass" or text == "fixed":
        return GREEN
    if text == "fail" or text == "open":
        return RED
    if text == "high" or text == "major":
        return ORANGE
    if text == "medium":
        return BLUE
    return MUTED


def qa_table(rows, widths, kind):
    table_data = []
    for r_idx, row in enumerate(rows):
        table_data.append([p(cell, "HeaderCell" if r_idx == 0 else "Cell") for cell in row])
    tbl = Table(table_data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    style = TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DEEP_GREEN),
        ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 3.5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3.5),
        ("TOPPADDING", (0, 0), (-1, -1), 3.2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
    ])
    if kind == "test":
        status_idx, priority_idx, severity_idx = 6, 7, 8
    else:
        status_idx, priority_idx, severity_idx = 6, 5, 4
    for idx, row in enumerate(rows[1:], start=1):
        for col in (status_idx, priority_idx, severity_idx):
            style.add("TEXTCOLOR", (col, idx), (col, idx), status_color(row[col]))
            style.add("FONTNAME", (col, idx), (col, idx), "Helvetica-Bold")
        style.add("BACKGROUND", (0, idx), (0, idx), LIGHT_GREEN)
        style.add("TEXTCOLOR", (0, idx), (0, idx), GREEN)
        style.add("FONTNAME", (0, idx), (0, idx), "Helvetica-Bold")
    tbl.setStyle(style)
    return tbl


def build():
    doc = BaseDocTemplate(OUT, pagesize=landscape(A4), rightMargin=10 * mm, leftMargin=10 * mm, topMargin=13 * mm, bottomMargin=15 * mm)
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=footer)])

    story = []
    story.append(Spacer(1, 20 * mm))
    story.append(p("C2C Agri Marketplace", "CoverTitle"))
    story.append(p("QA Test Case and Bug Report Portfolio Sample", "CoverSub"))
    meta = [
        ["Project Type", "Agriculture marketplace website"],
        ["Prepared By", "QA Tester"],
        ["Date", "18/04/2026"],
        ["Environment", "Windows 11 / Chrome / Desktop"],
        ["Document Type", "Manual QA test case and bug report sample"],
    ]
    story.append(make_table(meta, [45 * mm, 210 * mm], header=False))
    story.append(Spacer(1, 8 * mm))
    summary = [
        ["Coverage", "20 test cases across homepage, navigation, forms, authentication, product sections, and reporting flows"],
        ["Defect Reporting", "17 bug entries with severity, priority, status, and linked test references"],
        ["QA Focus", "Functional validation, UI behavior, navigation checks, form validation, and user-flow consistency"],
    ]
    story.append(make_table(summary, [45 * mm, 210 * mm], header=False))

    story.append(PageBreak())
    story.append(p("Test Cases", "H1x"))
    story.append(p("Representative manual QA test cases prepared for an agriculture marketplace website.", "Bodyx"))
    headers = ["TC ID", "Module", "Test Case Title", "Steps", "Expected Result", "Actual Result", "Status", "Pri.", "Sev.", "Bug ID"]
    widths = [14 * mm, 24 * mm, 46 * mm, 53 * mm, 43 * mm, 41 * mm, 14 * mm, 11 * mm, 11 * mm, 15 * mm]
    story.append(qa_table([headers] + test_cases, widths, "test"))

    story.append(PageBreak())
    story.append(p("Bug Report", "H1x"))
    story.append(p("Issue log showing defect title, linked test case, severity, priority, current status, and ownership.", "Bodyx"))
    bug_headers = ["Bug ID", "TC Ref", "Module", "Bug Title", "Severity", "Priority", "Status", "Assigned To"]
    bug_widths = [20 * mm, 18 * mm, 34 * mm, 115 * mm, 20 * mm, 20 * mm, 20 * mm, 30 * mm]
    story.append(qa_table([bug_headers] + bug_reports, bug_widths, "bug"))
    doc.build(story)


if __name__ == "__main__":
    build()
