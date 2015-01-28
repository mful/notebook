module Rateable
  DEFAULT_ZSCORE = 1.96

  def calculate_rating(score, n, options = {})
    return options[:default_rating].to_f || 0 if n <= 0

    sign = score < 0 ? -1 : 1
    phat = sign * score.to_f / n
    z = options[:zscore] || DEFAULT_ZSCORE

    sign * (phat + z*z/(2*n) - z * Math.sqrt((phat*(1-phat)+z*z/(4*n))/n))/(1+z*z/n)
  end
end
