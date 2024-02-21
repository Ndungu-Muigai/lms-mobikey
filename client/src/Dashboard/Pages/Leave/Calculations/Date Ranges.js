const DateRange= () =>
{
    const d=new Date()
    let currentYear=d.getFullYear()
    let month=d.getMonth() + 1
    let date=d.getDate()
    let minDateRange=""
    const maxDateRange=currentYear + "-12-31"

    if(month <= 9)
    {
        minDateRange=`${currentYear}-0${month}-${date}`
    }
    else
    {
        minDateRange=`${currentYear}-${month}-${date}`
    }

    return {minDateRange, maxDateRange}
}

export default DateRange