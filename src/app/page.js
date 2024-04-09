'use client';
import Image from 'next/image';
import { getCastsForChannel } from './server/actions';
import { FormEvent, useState } from 'react';
import { saveAs } from 'file-saver';

export default function Home() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [channelParentUrl, setChannelParentUrl] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = {
      channelParentUrl: e.target.channelParentUrl.value,
      startDate,
      endDate,
    };
    console.log('formdata', formData);
    const wordRes = await fetch('http://localhost:3000/api/casts/list', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('wordRes', wordRes);

    if (wordRes.ok) {
      // Create a blob from the response and trigger a download
      const blob = await wordRes.blob();
      console.log(blob);
      saveAs(blob, 'casts.docx');
    }
  };
  return (
    <main className="flex min-w-screen min-h-screen flex-col items-center justify-center lg:p-24">
      <div className="w-4/5  pb-20 flex flex-col justify-center items-center rounded-lg border border-gray-400 sm:min-w-96">
        <div className="w-full bg-red-200 rounded-t-lg pb-2 mb-4 flex justify-center items-center text-black md:text-6xl sm:text-4xl text-4xl font-urbanist font-bold">
          fetchcaster
        </div>
        <form
          onSubmit={onSubmitHandler}
          className="w-full mt-4 mb-10 flex flex-col justify-center items-center text-gray-500"
        >
          <div className="w-full mb-5 flex justify-center">
            <input
              className="peer block w-full mx-2 rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
              id="channelParentUrl"
              type="string"
              name="channelParentUrl"
              onChange={(e) => setChannelParentUrl(e.target.value)}
              value={channelParentUrl}
              placeholder="Enter channel URL"
              required
            />
          </div>
          {/* <div className="w-1/2 flex flex-col justify-around mt-2 mb-4">
            <input
              className="peer block rounded-md border border-gray-200 py-[9px] mb-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
              type="date"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              className="peer block rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
              type="date"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div> */}

          <button
            type="submit"
            className="mt-5 mb-2 bg-primary-blue w-1/3 py-2 rounded-lg text-white font-semibold"
            // formAction={getCastsForChannel}
          >
            Get Casts
          </button>
        </form>
      </div>
    </main>
  );
}
