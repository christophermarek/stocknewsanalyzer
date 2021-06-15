import React from "react";
import Select from 'react-select';

type Props = selectDayControlsProps;

const SelectDayControls: React.FC<Props> = ({ frequencyLists, setSelectedOneDay, selectedOneDay, setSingleDayFrequencyChartActive, setOneDayFrequencyChartData }) => {

    function getFrequenclyListsDatesArray() {
        let datesToPass: any = [];
        if (frequencyLists !== undefined) {
            let size = frequencyLists.length;
            for (let i = 0; i < size; i++) {
                datesToPass.push({ value: frequencyLists[i].date, label: frequencyLists[i].date });
            }
        }

        return datesToPass.reverse();
    }

    function singleDayFrequencyChartClicked() {
        if (selectedOneDay !== null && frequencyLists !== undefined) {
            setSingleDayFrequencyChartActive(true);

            let size = frequencyLists.length;
            for (let i = 0; i < size; i++) {
                if (frequencyLists[i].date === selectedOneDay.value) {
                    setOneDayFrequencyChartData(frequencyLists[i]);
                }
            }
        } else {
            alert("Must select a date from the dropdown");
        }
    }

    return (
        <div className="selectDayControls">
            <p>View a frequency chart for a single day</p>
            <Select
                defaultValue={selectedOneDay}
                onChange={setSelectedOneDay}
                options={getFrequenclyListsDatesArray()}
                className="dateInput"
            />
            <input type="button" className="subButton" onClick={singleDayFrequencyChartClicked} value="View Frequency Chart" />
        </div>
    )
}

export default SelectDayControls;
