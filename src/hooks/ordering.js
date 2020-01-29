import React, {useState, useMemo, useEffect} from 'react';
import { useStateValue } from '../contexts/OpenDataContext';

export default function orderData(data, criteria) {
	// get data

	// order by criteria
	return useMemo(() => {	
		let sortedDatasets = data;
		
	// return ordered data
		return sortedDatasets;
	}, [data, criteria]);	

	
}