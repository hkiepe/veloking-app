const validateForm = (formData) => {
  const result = [];

  if (formData.current === 0) {
    if (formData.firstName.length < 1) {
      result.push({ message: "Please provide a first name" });
    }
    if (formData.lastName.length < 1) {
      result.push({ message: "Please provide a last name" });
    }
    if (formData.peselSelected && formData.pesel.length < 8) {
      result.push({ message: "Please provide a pesel" });
    }
    if (!formData.peselSelected && formData.idNumber.length < 4) {
      result.push({ message: "Please provide an id number" });
    }
    if (!formData.peselSelected && formData.country.length < 2) {
      result.push({ message: "Please provide a country" });
    }
    if (formData.addressSelected && formData.streetAndNumber < 1) {
      result.push({ message: "Please provide a street number" });
    }
    if (formData.addressSelected && formData.location < 1) {
      result.push({ message: "Please provide a location" });
    }
    if (formData.addressSelected && formData.postcode < 4) {
      result.push({ message: "Please provide a postcode" });
    }
    if (formData.addressSelected && formData.postcode < 4) {
      result.push({ message: "Please provide a postcode" });
    }
  }

  if (formData.current === 1) {
    if (formData.email < 6) {
      result.push({ message: "Please provide valid email" });
    }
    if (formData.countryCode < 6) {
      result.push({ message: "Please provide valid country code" });
    }
    if (formData.phone < 6) {
      result.push({ message: "Please provide valid phone number" });
    }
  }

  if (formData.current === 2) {
    if (formData.vehicles.length < 1) {
      result.push({ message: "Please provide vehicles" });
    }
    if (formData.interval === "Hours" && parseInt(formData.hours.substring(0, 2)) === 0 && parseInt(formData.hours.substring(3, 5)) === 0) {
      result.push({ message: "Please provide valid hours" });
    }
    if (formData.interval === "Days" && formData.days === 0) {
      result.push({ message: "Please provide a valid day" });
    }
  }

  if (formData.current === 3) {
    if (isNaN(formData.payments[0].amount)) {
      result.push({ message: "Please provide a valid amount" });
    }
  }
  return result;
};

export default validateForm;
