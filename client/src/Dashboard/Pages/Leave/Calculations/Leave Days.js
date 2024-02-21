import Holidays from 'date-holidays'

const Days = (start_date, end_date, leave_type, leave_duration) => 
{
    // Converting the start and end date strings to date objects
    start_date = new Date(start_date);
    end_date = new Date(end_date);

    //Subtracting the difference between the start and end dates
    let dateDifference=(end_date - start_date) / (24 * 60 * 60 * 1000) + 1 

    // Getting the current year in order to get the year's holidays later on
    const year = new Date().getFullYear();

    // Creating an instance of the Holidays class
    let hd = new Holidays("KE"); // Assuming "KE" is the country code for Kenya

    // Getting the holidays for the current year
    let currentHolidays = hd.getHolidays(year);

    //Mapping over the holidays array and extracting the dates
    let holidayDates=[]
    currentHolidays.map(holiday => holidayDates.push(holiday.date.split(" ")[0]))
    
    //Variable that stores the number of holidays
    let holidaysCount = 0;

    //Stroing the number of Saturdays and Sundays
    let saturdays=0
    let sundays=0

    //Mapping over the extracted holiday dates and checking if the dates between the start and end dates are holidays
    let currentDate = new Date(start_date);
    let leaveDates = [];
    while (currentDate <= end_date) 
    {
        leaveDates.push(new Date(currentDate)); // Push Date objects

        //Splitting the current date
        const comparedDate = currentDate.toISOString().split("T")[0];

        //If the date is in the holidayDates, increment value of holidaysCount
        if (holidayDates.includes(comparedDate)) 
        {
            holidaysCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

        //Looping over this array that contains all the leave dates and checking if the date is a saturday or sunday
        leaveDates.forEach(date => 
        {
            if (date.getDay() === 0)
            {
                sundays += 1;
            } 
            else if (date.getDay() === 6) 
            {
                saturdays += 1;
            }
        });
    
    if(leave_type === "" || leave_duration === "" || start_date === "" || end_date === "")
    {
        dateDifference=0
    }

    if(leave_type === "Maternity" || leave_type === "Paternity")
    {
        return dateDifference
    }
    else
    {
        if(leave_duration === "")
        {
            dateDifference=0
        }
        else if(leave_duration === "Full")
        {
            dateDifference=dateDifference - ((saturdays * 0.5) + (sundays * 1) + (holidaysCount * 1))
        }
        else if(leave_duration === "Half")
        {
            dateDifference=(dateDifference - (sundays * 1) - (holidaysCount * 1))/2 
        }
    }
    return dateDifference
};

export default Days