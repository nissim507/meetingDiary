from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def test_login_meeting_diary():
    # --- Headless Chrome setup ---
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # run without GUI
    chrome_options.add_argument("--no-sandbox")  # required for some Linux environments
    chrome_options.add_argument("--disable-dev-shm-usage")  # prevent memory issues in containers

    driver = webdriver.Chrome(options=chrome_options)  # use headless options

    try:
        driver.get("http://localhost:5173")  # make sure your frontend is running

        wait = WebDriverWait(driver, 10)

        # Step 1: Click the initial Login button to open the login form
        login_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Login']"))
        )
        login_button.click()

        # Step 2: Wait for username input to appear
        username_input = wait.until(
            EC.visibility_of_element_located((By.NAME, "username"))
        )
        username_input.send_keys("moshe")

        # Step 3: Enter password
        password_input = driver.find_element(By.NAME, "password")
        password_input.send_keys("1234")

        # Step 4: Submit login form
        submit_button = driver.find_element(By.XPATH, "//button[text()='Login']")
        submit_button.click()

        # Step 5: Wait until dashboard page loads
        wait.until(EC.url_contains("/dashboard"))
        assert "/dashboard" in driver.current_url

    finally:
        driver.quit()
