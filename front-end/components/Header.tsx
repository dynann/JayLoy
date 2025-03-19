"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import dayjs from "dayjs"
import { formatCurrency } from "@/utils/formatCurrency"

interface HeaderProps {
  title: string
  income: number
  expense: number
  date: string
  onDateChange: (date: string) => void
}

export const Header = ({ title, income, expense, date, onDateChange }: HeaderProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Convert string date to Date object for the DatePicker
  const dateObj = dayjs(date).toDate()

  const handleDateChange = (selectedDate: Date | null) => {
    if (!selectedDate) return

    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD")
    onDateChange(formattedDate)
    setIsDatePickerOpen(false)
  }

  const isToday = dayjs(date).isSame(dayjs(), "day")

  return (
    <div className="bg-emerald-500 text-white p-4 w-full shadow-lg">
      <h1 className="sub-header-white text-center">{title}</h1>

      <div className="flex items-center justify-center mt-3 gap-x-10">
        <div className="space-y-1">
          <div className="description-big-medium">Expenses:</div>
          <div className="description-big-medium">{formatCurrency(Math.abs(expense))}</div>
        </div>

        <div className="flex items-center gap-x-6">
          <div className="space-y-1 text-center">
            <div className="description-big-medium">Income:</div>
            <div className="description-big-medium">{formatCurrency(income)}</div>
          </div>

          <div className="w-[2px] h-10 bg-black/20"></div>

          <div className="text-right">
            <div className="description-big-medium">{dayjs(date).format("YYYY-MM-DD")}</div>
            <div
              className="flex items-center gap-1 justify-center cursor-pointer hover:bg-white/10 rounded-md px-2 py-1"
              onClick={() => setIsDatePickerOpen(true)}
            >
              <Icon icon="mdi:calendar" className="w-4 h-4" />
              <span className="text-sm">{isToday ? "Today" : "Select Date"}</span>
            </div>

            {isDatePickerOpen && (
              <div className="absolute z-50 mt-1 right-4 left-4 sm:left-auto sm:right-auto sm:w-72">
                <DatePicker
                  selected={dateObj}
                  onChange={handleDateChange}
                  inline
                  maxDate={new Date()} // no future date
                  className="bg-white text-black rounded-lg shadow-lg"
                  calendarClassName="bg-white rounded-lg shadow-lg border border-gray-200"
                  wrapperClassName="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

