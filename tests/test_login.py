from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_login_meeting_diary():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    try:
        driver.get("http://localhost:5173")
        wait = WebDriverWait(driver, 10)
        login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Login']")))
        login_button.click()
        username_input = wait.until(EC.visibility_of_element_located((By.NAME, "username")))
        username_input.send_keys("moshe")
        password_input = driver.find_element(By.NAME, "password")
        password_input.send_keys("1234")
        submit_button = driver.find_element(By.XPATH, "//button[text()='Login']")
        submit_button.click()
        wait.until(EC.url_contains("/dashboard"))
        assert "/dashboard" in driver.current_url
    finally:
        driver.quit()
