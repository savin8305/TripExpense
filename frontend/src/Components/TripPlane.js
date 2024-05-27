import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import DialogBox from './NestedForm'

const TripPlane = (props) => {
  const [details, setDetails] = useState([]);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editClickState, setEditClickState] = React.useState(false);
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/getdata");
      setDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/deletedata/${id}`);
      setDetails(details.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleEditClicked = () => {
    setEditClickState(true);
  };
  return (
    <div style={{ width: "80vw", height: "80%", marginTop: "8rem", marginLeft: "8rem", marginBottom: "5rem", zIndex: "999" }}>
      <h1 style={{ textAlign: "center" }}>Trip Plane</h1>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>Sr</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>Date</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>Day</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>Country</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>State</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>City</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>ClientName</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>Purpose</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>Remarks</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>isdelete</TableCell>
              <TableCell align="left" style={{ border: '3px solid #ddd', fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((row) => (
              !row.isDelete && (
                <TableRow
                  key={row.Data?._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" style={{ border: '1px solid #ddd' }} component="th" scope="row">
                    {row.SRNumber}
                  </TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>{row.Date}</TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>{row.Day}</TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>{row.Country}</TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>{row.State}</TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>{row.City}</TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>{row.ClientName}</TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>{row.Purpose}</TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>{row.Remarks}</TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>{row.isDelete.toString()}</TableCell>
                  <TableCell align="left" style={{ border: '1px solid #ddd' }}>
                    <IconButton color="primary">
                      <DialogBox tableData={props.tableData} settableData={props.settableData} date={props.date} day={row._id} type={"updatedata"} row={row} />
                    </IconButton>
                    <IconButton color="secondary" aria-label="delete" onClick={() => deleteData(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default TripPlane;
