module AsyncHelper

  def wait_for(max_time = 10, &condition)
    seconds = 0
    loop do
      break if condition.yield || seconds > max_time
      seconds += 1
      sleep 1
    end
  end

  def wait_for_alert(max_time = 10)
    wait_for max_time do
      begin
        page.driver.browser.switch_to.alert
      rescue Selenium::WebDriver::Error::NoAlertPresentError => e
        false
      else
        true
      end
    end
  end

end
