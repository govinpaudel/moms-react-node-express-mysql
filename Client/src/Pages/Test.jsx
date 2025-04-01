import React, { useState } from 'react';

import Calendar from '@sbmdkl/nepali-datepicker-reactjs';
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';

function Test() {
	const [date, setDate] = useState('');

	const handleDate = ({ bsDate, adDate }) => {
		setDate({ date: bsDate });
	};
	return (
		<div>
			<h1>Nepali Date Picker for React</h1>
			<Calendar language="en" onChange={handleDate} theme='green' />
		</div>
	);
}

export default Test;