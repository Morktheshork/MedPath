// Wait for DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function () {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('href').substring(1);

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show target page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Booking Modal
    const openBookingBtn = document.getElementById('openBooking');
    const closeModalBtn = document.getElementById('closeModal');
    const bookingModal = document.getElementById('bookingModal');
    const tutorOptions = document.querySelectorAll('.tutor-option');
    const calendarContainer = document.getElementById('calendarContainer');
    const bookingSummary = document.getElementById('bookingSummary');
    const confirmBookingBtn = document.getElementById('confirmBooking');

    let selectedTutor = null;
    let selectedDate = null;
    let selectedTime = null;
    let currentMonth = new Date();

    openBookingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeModalBtn.addEventListener('click', () => {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetBooking();
    });

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            resetBooking();
        }
    });

    tutorOptions.forEach(option => {
        option.addEventListener('click', () => {
            tutorOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedTutor = option.dataset.tutor;
            calendarContainer.style.display = 'block';
            renderCalendar();
        });
    });

    function renderCalendar() {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            calendarGrid.appendChild(header);
        });

        // Add empty cells for days before the first of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            const cellDate = new Date(year, month, day);
            const dayOfWeek = cellDate.getDay();

            // Samuel past dates
            if (cellDate < today) {
                dayCell.classList.add('past');
            }
            // Weekends are unavailable
            else if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayCell.classList.add('unavailable');
            }
            // Weekdays are available
            else {
                dayCell.classList.add('available');
                dayCell.addEventListener('click', () => selectDate(cellDate, dayCell));
            }

            calendarGrid.appendChild(dayCell);
        }
    }

    function selectDate(date, cell) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        cell.classList.add('selected');

        selectedDate = date;
        renderTimeSlots();
    }

    function renderTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        const timeNotification = document.getElementById('timeNotification');

        timeSlotsContainer.innerHTML = '';
        timeSlotsContainer.classList.add('active');

        // Show notification banner
        timeNotification.classList.add('active');

        // Generate time slots from 5pm to 9pm (weekday availability)
        const times = [
            '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
        ];

        times.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
            timeSlotsContainer.appendChild(timeSlot);
        });

        // Auto-scroll to time slots with smooth animation
        setTimeout(() => {
            timeSlotsContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }

    function selectTime(time, slot) {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTime = time;
        updateBookingSummary();
    }

    function updateBookingSummary() {
        if (selectedTutor && selectedDate && selectedTime) {
            const tutorNames = {
                'Samuel': 'Samuel - Head Tutor & Financial Counselor',
                'josh': 'Josh - Science-Focused Tutor',
                'angie': 'Angie - MCAT Tutor'
            };

            document.getElementById('summaryTutor').textContent = tutorNames[selectedTutor];
            document.getElementById('summaryDate').textContent = selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('summaryTime').textContent = selectedTime;

            bookingSummary.classList.add('active');

            // Auto-scroll to booking summary with smooth animation
            setTimeout(() => {
                bookingSummary.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }
    }

    function resetBooking() {
        selectedTutor = null;
        selectedDate = null;
        selectedTime = null;
        tutorOptions.forEach(o => o.classList.remove('selected'));
        calendarContainer.style.display = 'none';
        bookingSummary.classList.remove('active');
        document.getElementById('timeSlots').classList.remove('active');
        document.getElementById('timeNotification').classList.remove('active');
    }

    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderCalendar();
    });

    // Confirm booking
    confirmBookingBtn.addEventListener('click', async () => {
        const originalBtnText = confirmBookingBtn.textContent;
        confirmBookingBtn.textContent = 'Processing...';
        confirmBookingBtn.disabled = true;

        const tutorNames = {
            'Samuel': 'Samuel',
            'josh': 'Josh',
            'angie': 'Angie'
        };

        // 1. Get Referral Code
        const referralCode = localStorage.getItem('medpath_referral_code') || null;

        // 2. Log to Supabase
        try {
            if (supabase) {
                const { error } = await supabase
                    .from('booking_requests')
                    .insert({
                        tutor_name: tutorNames[selectedTutor],
                        booking_date: selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                        booking_time: selectedTime,
                        referral_code: referralCode
                    });

                if (error) {
                    console.error('Error logging booking:', error);
                }
            } else {
                console.warn('Supabase not available, skipping log.');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }

        // 3. Construct Email
        const emailBody = `Hello,

I would like to request a booking with the following details:

Tutor: ${tutorNames[selectedTutor]}
Date: ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${selectedTime}

Thank you!`;

        const mailtoLink = `mailto:medpathhelp@gmail.com?subject=Booking Request - ${tutorNames[selectedTutor]}&body=${encodeURIComponent(emailBody)}`;

        // 4. Open Email Client
        window.location.href = mailtoLink;

        // 5. Cleanup
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetBooking();
        confirmBookingBtn.textContent = originalBtnText;
        confirmBookingBtn.disabled = false;
    });

    // --- Supabase Integration ---
    const SUPABASE_URL = 'https://voqxmbzpzguxvqqjygro.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcXhtYnpwemd1eHZxcWp5Z3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzE5OTEsImV4cCI6MjA4NTMwNzk5MX0.gDPOeIBHutjmzre8mmK__qUhB4pFMM0-G3amfaah5hU';

    let supabase = null;

    try {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        } else {
            console.warn('Supabase/internet not detected. Site will work offline, but tracking is disabled.');
        }
    } catch (e) {
        console.error('Error initializing Supabase:', e);
    }

    // Track Referral on Page Load
    async function trackReferral() {
        // Check URL for ?ref=CODE
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');

        if (refCode) {
            console.log('Referral code found:', refCode);
            // Save to localStorage so we remember them even if they navigate/refresh
            localStorage.setItem('medpath_referral_code', refCode);

            // Log the visit if Supabase is available
            if (supabase) {
                const { error } = await supabase
                    .from('referral_visits')
                    .insert({
                        referral_code: refCode,
                        user_agent: navigator.userAgent
                    });

                if (error) console.error('Error logging visit:', error);
            }
        }
    }

    // Run tracking logic safely
    trackReferral();

}); // End DOMContentLoaded

