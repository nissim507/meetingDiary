from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_login_meeting_diary():
    # Chrome headless setup
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Automatically download matching ChromeDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    try:
        driver.get("http://localhost:5173")  # your frontend URL

        wait = WebDriverWait(driver, 10)

        # Step 1: Click Login button
        login_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Login']"))
        )
        login_button.click()

        # Step 2: Enter username
        username_input = wait.until(
            EC.visibility_of_element_located((By.NAME, "username"))
        )
        username_input.send_keys("moshe")

        # Step 3: Enter password
        password_input = driver.find_element(By.NAME, "password")
        password_input.send_keys("1234")

        # Step 4: Submit form
        submit_button = driver.find_element(By.XPATH, "//button[text()='Login']")
        submit_button.click()

        # Step 5: Verify dashboard
        wait.until(EC.url_contains("/dashboard"))
        assert "/dashboard" in driver.current_url

    finally:
        driver.quit()

if __name__ == "__main__":
    test_login_meeting_diary()
    print("Test completed successfully!")
