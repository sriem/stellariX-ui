import React, { useEffect } from 'react';
import { createSelect } from '../src';
import { reactAdapter } from '@stellarix-ui/react';

const mockOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
];

export function DebugSelect() {
    const select = React.useMemo(() => createSelect({ 
        options: mockOptions,
        onChange: (value, option) => {
            console.log('onChange called:', value, option);
        }
    }), []);
    
    const SelectComponent = React.useMemo(() => select.connect(reactAdapter), [select]);
    
    // Subscribe to state changes
    useEffect(() => {
        const unsubscribe = select.state.subscribe((newState) => {
            console.log('State updated:', newState);
        });
        
        return unsubscribe;
    }, [select]);
    
    return (
        <div>
            <h1>Debug Select</h1>
            <SelectComponent />
            <button onClick={() => {
                console.log('Current state:', select.state.getState());
            }}>Log State</button>
            <button onClick={() => {
                select.selectOption('banana');
                console.log('Selected banana programmatically');
            }}>Select Banana</button>
        </div>
    );
}