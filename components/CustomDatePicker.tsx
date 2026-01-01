
import React, { useState, useEffect } from 'react';

interface CustomDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    label?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label }) => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    // 초기값 파싱
    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-');
            setYear(y);
            setMonth(m);
            setDay(d);
        } else {
            // 기본값 설정 (예: 1990-01-01)
            setYear('1990');
            setMonth('01');
            setDay('01');
        }
    }, [value]);

    // 연도 범위 생성 (현재 년도 기준 120년 전부터 2026년까지)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 130 }, (_, i) => (currentYear + 1 - i).toString());
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

    // 선택된 년, 월에 따른 일수 생성
    const getDaysInMonth = (y: string, m: string) => {
        if (!y || !m) return 31;
        return new Date(parseInt(y), parseInt(m), 0).getDate();
    };

    const daysCount = getDaysInMonth(year, month);
    const days = Array.from({ length: daysCount }, (_, i) => (i + 1).toString().padStart(2, '0'));

    const handleUpdate = (y: string, m: string, d: string) => {
        // 일수가 변경된 달보다 클 경우 조정
        const maxDays = getDaysInMonth(y, m);
        let validDay = d;
        if (parseInt(d) > maxDays) {
            validDay = maxDays.toString().padStart(2, '0');
            setDay(validDay);
        }
        onChange(`${y}-${m}-${validDay}`);
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm text-stone-400">{label}</label>}
            <div className="grid grid-cols-3 gap-2">
                {/* 년 */}
                <div className="relative group">
                    <select
                        value={year}
                        onChange={(e) => { setYear(e.target.value); handleUpdate(e.target.value, month, day); }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2 py-3 focus:outline-none focus:border-amber-500 text-white appearance-none text-sm"
                    >
                        {years.map(y => <option key={y} value={y}>{y}년</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-xs">▼</span>
                </div>
                {/* 월 */}
                <div className="relative group">
                    <select
                        value={month}
                        onChange={(e) => { setMonth(e.target.value); handleUpdate(year, e.target.value, day); }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2 py-3 focus:outline-none focus:border-amber-500 text-white appearance-none text-sm text-center"
                    >
                        {months.map(m => <option key={m} value={m}>{parseInt(m)}월</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-xs">▼</span>
                </div>
                {/* 일 */}
                <div className="relative group">
                    <select
                        value={day}
                        onChange={(e) => { setDay(e.target.value); handleUpdate(year, month, e.target.value); }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2 py-3 focus:outline-none focus:border-amber-500 text-white appearance-none text-sm text-center"
                    >
                        {days.map(d => <option key={d} value={d}>{parseInt(d)}일</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-xs">▼</span>
                </div>
            </div>
        </div>
    );
};

export default CustomDatePicker;
