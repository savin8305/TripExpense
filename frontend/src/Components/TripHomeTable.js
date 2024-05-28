import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TripModal from "./TripForTable.js";

const BasicTable = (props) => {
  const [details, setDetails] = React.useState([]);
  const [searchPlanId, setSearchPlanId] = React.useState("");
  const [editClickState, setEditClickState] = React.useState(false);
  const [editDate, setEditDate] = React.useState("");
  const [editDay, setEditDay] = React.useState("");
  const [editCountry, setEditCountry] = React.useState("");
  const [editState, setEditState] = React.useState("");
  const [editCity, setEditCity] = React.useState("");
  const [editClientName, setEditClientName] = React.useState("");
  const [editPurpose, setEditPurpose] = React.useState("");
  const [editRemarks, setEditRemarks] = React.useState("");
  const [editisDelete, setEditIsDelete] = React.useState(false);
  const [idforEdit, setId] = React.useState("");

  React.useEffect(() => {
    fetchData();
  }, [searchPlanId, props.tableData]); // Fetch data when searchPlanId or tableData changes

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getdata?PlanId=${searchPlanId}`);
      setDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/deletedata/${id}`);
      setDetails(details.filter((item) => item._id !== id));
      toast.success("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item. Please try again.");
    }
  };

  const handleSearch = (e) => {
    setSearchPlanId(e.target.value);
  };

  const submitTableData = async () => {
    if (editClickState) {
      const updatedData = {
        Date: editDate,
        Day: editDay,
        Country: editCountry,
        State: editState,
        City: editCity,
        ClientName: editClientName,
        Purpose: editPurpose,
        Remarks: editRemarks,
        isDelete: editisDelete,
      };
      await updateTableData(updatedData);
    } else {
      try {
        const tripTableData = convertToObjects(props.saveDataParent);
        const { employeeID: employee, employeeName: employeename, type, dept: department, srno: sno } = props;
        await axios.post("http://localhost:4000/tripData", { tripTableData, employee, employeename, type, department, sno });
        toast.success("Data submitted successfully!");
        fetchData(); // Fetch the updated data immediately after submission
      } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Error submitting data. Please try again.");
      }
      props.settableData([]);
      props.setsaveDataParent([]);
    }
  };

  const convertToObjects = (array) => {
    const objeArray = [];
    for (let i = 0; i < array.length; i++) {
      const innerArray = array[i];
      const obj = {};
      for (let j = 0; j < innerArray.length; j++) {
        switch (j) {
          case 0:
            obj.Date = innerArray[j];
            break;
          case 1:
            obj.Country = innerArray[j];
            break;
          case 2:
            obj.State = innerArray[j];
            break;
          case 3:
            obj.City = innerArray[j];
            break;
          case 4:
            obj.ClientName = innerArray[j];
            break;
          case 5:
            obj.Purpose = innerArray[j];
            break;
          case 6:
            obj.Remarks = innerArray[j];
            break;
          case 7:
            obj.Day = innerArray[j];
            break;
        }
      }
      objeArray.push(obj);
    }
    return objeArray;
  };

  const handleEdit = (row) => {
    const { Date, Day, Country, State, City, ClientName, Purpose, Remarks, isDelete, _id } = row;
    setEditDate(Date);
    setEditDay(Day);
    setEditCountry(Country);
    setEditState(State);
    setEditCity(City);
    setEditClientName(ClientName);
    setEditPurpose(Purpose);
    setEditRemarks(Remarks);
    setEditIsDelete(isDelete);
    setId(_id);
    setEditClickState(true);
  };

  const updateTableData = async (updatedData) => {
    try {
      await axios.put(`http://localhost:4000/updatedata/${idforEdit}`, updatedData);
      toast.success("Data updated successfully!");
      setEditClickState(false);
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data. Please try again.");
    }
  };

  React.useEffect(() => {
    console.log("props.check:", props.check);
  }, [props.check]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div className="maintTripHomeTable" style={{ margin: "1rem", overflowY: "hidden", overflowX: "auto", width: "100%" }}>
        <TableContainer component={Paper} style={{ maxHeight: "400px" }}>
          <Table aria-label="simple table" size="small">
            <TableHead style={{ backgroundColor: props.check ? "black" : "#F4F6F6 " }}>
              <TableRow>
                {["Sr", "Date", "Day", "Country", "State", "City", "ClientName", "Purpose", "Remarks", "isDelete", "Actions"].map((header, index) => (
                  <TableCell key={index} align="left" style={{ border: "1px solid #ddd", fontWeight: "bold", padding: "4px" }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map((row, index) => (
                !row.isDelete && (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    {[row.SRNumber, row.Date, row.Day, row.Country, row.State, row.City, row.ClientName, row.Purpose, row.Remarks, row.isDelete.toString()].map((data, dataIndex) => (
                      <TableCell key={dataIndex} align="left" style={{ border: '1px solid #ddd', padding: "4px", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data}</TableCell>
                    ))}
                    <TableCell align="left" style={{ border: '1px solid #ddd', padding: "4px" }}>
                      <IconButton color="primary">
                        <EditIcon style={{ color: props.check ? "white" : "black" }} onClick={() => handleEdit(row)} />
                        <TripModal
                          idforEdit={idforEdit}
                          dates={editDate}
                          days={editDay}
                          Country={editCountry}
                          State={editState}
                          City={editCity}
                          ClientName={editClientName}
                          Purpose={editPurpose}
                          Remarks={editRemarks}
                          isDelete={editisDelete}
                          check={props.check}
                          tableData={props.tableData}
                          settableData={props.settableData}
                          editClickState={editClickState}
                          setEditClickState={setEditClickState}
                          updateTableData={updateTableData}
                          type={"doNotOpen"}
                          types={"newthing"}
                        />
                      </IconButton>
                      <IconButton color="secondary" aria-label="delete" onClick={() => deleteData(row._id)}>
                        <DeleteIcon style={{ color: props.check ? "white" : "black" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <Button
          style={{ backgroundColor: props.check ? "white" : "black" }}
          variant="contained"
          onClick={submitTableData}
          size="medium"
        >
          {editClickState ? "Update" : "Submit"}
        </Button>
        <Button
          style={{ marginLeft: "20px", backgroundColor: props.check ? "white" : "black" }}
          variant="contained"
          size="medium"
          onClick={() => props.setsaveDataParent([])}
        >
          Clear
        </Button>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default BasicTable;
