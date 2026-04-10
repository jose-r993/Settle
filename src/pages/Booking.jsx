import { useState } from 'react';
import { getListing } from '../data/listings';

const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
const UNAVAILABLE = [2, 5]; // index of unavailable time slots

// April 2026
const DAYS_IN_MONTH = 30;
const FIRST_DAY_OF_WEEK = 2; // Wednesday (0=Sun)
const UNAVAILABLE_DAYS = [1, 3, 7, 8, 14, 15, 21, 22, 28, 29];

export default function Booking({ id, onNavigate }) {
  const listing = getListing(id);
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [tourType,     setTourType]     = useState('in-person');
  const [notes,        setNotes]        = useState('');
  const [confirmed,    setConfirmed]    = useState(false);

  if (confirmed) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-screen-xl mx-auto w-full flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface mb-3">Tour Confirmed!</h1>
          <p className="text-on-surface-variant font-medium mb-2">{listing.name}</p>
          <p className="text-on-surface font-bold mb-1">
            {selectedDay ? `April ${selectedDay}, 2026` : 'Date TBD'} at {selectedTime ?? 'Time TBD'}
          </p>
          <p className="text-on-surface-variant text-sm mb-8">{tourType === 'in-person' ? 'In-Person Tour' : 'Video Tour'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onNavigate('/notifications')}
              className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95"
            >
              View in Notifications
            </button>
            <button
              onClick={() => onNavigate('/search')}
              className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-highest transition active:scale-95"
            >
              Continue Searching
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-xl mx-auto w-full">

      <button
        onClick={() => onNavigate(`/listing/${id}`)}
        className="flex items-center gap-1 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Listing
      </button>

      {/* Property summary */}
      <div className="bg-surface-container-lowest rounded-xl p-6 flex gap-5 items-center mb-10 editorial-shadow">
        <img src={listing.images[0]} alt="" className="w-24 h-20 rounded-xl object-cover shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-on-surface mb-1">{listing.name}</h2>
          <p className="text-on-surface-variant font-medium text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {listing.address}
          </p>
          <p className="text-primary font-bold mt-1">{listing.price}/mo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Left — booking form */}
        <div className="lg:col-span-7 space-y-8">

          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Choose Your Tour Date & Time</h1>

          {/* Calendar */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-on-surface">April 2026</h3>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-surface-container transition">
                  <span className="material-symbols-outlined text-[18px] text-outline">chevron_left</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-surface-container transition">
                  <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[0.65rem] font-bold uppercase tracking-[0.1em] text-outline py-2">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for first day offset */}
              {Array.from({ length: FIRST_DAY_OF_WEEK }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map(day => {
                const isUnavail = UNAVAILABLE_DAYS.includes(day);
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    disabled={isUnavail}
                    onClick={() => setSelectedDay(day)}
                    className={[
                      'aspect-square rounded-xl text-sm font-bold transition-all',
                      isSelected  ? 'bg-primary text-white shadow-lg' :
                      isUnavail   ? 'text-outline opacity-40 cursor-not-allowed' :
                                    'text-on-surface hover:bg-primary/10 hover:text-primary',
                    ].join(' ')}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[0.65rem] font-medium text-on-surface-variant">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-surface-container-high" />
                <span className="text-[0.65rem] font-medium text-on-surface-variant">Unavailable</span>
              </div>
            </div>
          </div>

          {/* Time slots */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <h3 className="text-lg font-bold text-on-surface mb-6">Available Times</h3>
            <div className="grid grid-cols-4 gap-3">
              {TIMES.map((time, i) => {
                const isUnavail = UNAVAILABLE.includes(i);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    disabled={isUnavail}
                    onClick={() => setSelectedTime(time)}
                    className={[
                      'py-3 rounded-xl text-sm font-bold transition-all',
                      isSelected  ? 'bg-primary text-white shadow-lg' :
                      isUnavail   ? 'bg-surface-container text-outline opacity-40 cursor-not-allowed' :
                                    'bg-surface-container-lowest text-on-surface hover:bg-primary/10 hover:text-primary editorial-shadow',
                    ].join(' ')}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tour type */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <h3 className="text-lg font-bold text-on-surface mb-6">Tour Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'in-person', label: 'In-Person Tour', icon: 'location_on',   desc: 'Visit the unit yourself' },
                { value: 'video',     label: 'Video Tour',     icon: 'videocam',      desc: 'Virtual walkthrough' },
              ].map(({ value, label, icon, desc }) => (
                <button
                  key={value}
                  onClick={() => setTourType(value)}
                  className={[
                    'flex flex-col items-center gap-3 p-6 rounded-xl transition-all',
                    tourType === value ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-surface-container hover:bg-surface-container-high',
                  ].join(' ')}
                >
                  <span className={`material-symbols-outlined text-[28px] ${tourType === value ? 'text-primary' : 'text-outline'}`}>{icon}</span>
                  <span className={`text-sm font-bold ${tourType === value ? 'text-primary' : 'text-on-surface'}`}>{label}</span>
                  <span className="text-[0.7rem] text-on-surface-variant font-medium">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special requests */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <h3 className="text-lg font-bold text-on-surface mb-4">Special Requests <span className="text-on-surface-variant font-normal text-sm">(optional)</span></h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any accessibility needs, questions, or notes for the agent…"
              rows={4}
              className="w-full bg-surface-container-lowest shadow-sm rounded-lg px-4 py-3 text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow resize-none"
            />
          </div>
        </div>

        {/* Right — booking summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6">Booking Summary</p>
            <div className="space-y-4 mb-8">
              {[
                { label: 'Property',   value: listing.name, icon: 'home_work' },
                { label: 'Address',    value: listing.address, icon: 'location_on' },
                { label: 'Tour Date',  value: selectedDay ? `April ${selectedDay}, 2026` : 'Not selected', icon: 'calendar_month' },
                { label: 'Tour Time',  value: selectedTime ?? 'Not selected', icon: 'schedule' },
                { label: 'Tour Type',  value: tourType === 'in-person' ? 'In-Person' : 'Video', icon: tourType === 'in-person' ? 'location_on' : 'videocam' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">{label}</p>
                    <p className="text-sm font-bold text-on-surface">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { if (selectedDay && selectedTime) setConfirmed(true); }}
              disabled={!selectedDay || !selectedTime}
              className={[
                'w-full py-4 rounded-xl font-bold text-base transition-all',
                selectedDay && selectedTime
                  ? 'bg-gradient-to-br from-primary to-primary-container text-white hover:shadow-lg active:scale-95'
                  : 'bg-surface-container-highest text-outline cursor-not-allowed',
              ].join(' ')}
            >
              Confirm Tour Booking
            </button>
            {(!selectedDay || !selectedTime) && (
              <p className="text-center text-[0.7rem] text-outline mt-3">Select a date and time to continue</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
