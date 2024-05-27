import { Data } from "../db.js";
import { updateSheetWithData } from "../googleSheets.js";

export async function handleTripDataPost(req, res) {
    const { PlanId, tripTableData, employee, employeename, type, department, sno } = req.body;
    const data = new Data({
        PlanId: PlanId,
        EmployeeId: employee,
        EmployeeName: employeename,
        Type: type,
        Department: department,
        SRNumber: sno || 2,
        Data: tripTableData,
    });
    try {
        await data.save();
        res.status(204).send();
        DataformatingforSheet();
    } catch (error) {
        console.error("Error saving trip data:", error);
        res.status(500).send("Internal Server Error");
    }
}

export default async function DataformatingforSheet() {
    try {
        const documents = await Data.find({});
        let arr = [];
        for (let i = 0; i < documents.length; i++) {
            const { PlanId, EmployeeId, EmployeeName, Type, Department, SRNumber, Data: tripData } = documents[i];
            for (let j = 0; j < tripData.length; j++) {
                const { Date, Day, Country, State, City, ClientName, Purpose, Remarks, isDelete } = tripData[j];
                arr.push([PlanId, EmployeeId.join(", "), EmployeeName.join(", "), Type, Department, SRNumber, Date, Day, Country, State, City, ClientName, Purpose, Remarks, isDelete]);
            }
        }
        console.log(arr);
        await updateSheetWithData(arr);
    } catch (error) {
        console.error("Error processing trip data:", error);
    }
}

export async function getData(req, res) {
    try {
        const { PlanId } = req.query;
        let query = {};
        if (PlanId) {
            query.PlanId = PlanId;
        }
        const documents = await Data.find(query);
        const formattedData = documents.flatMap(doc => {
            const { EmployeeId, EmployeeName, Type, Department, SRNumber, Data: tripData, _id, isDelete } = doc;
            return tripData.map(({ Date, Day, Country, State, City, ClientName, Purpose, Remarks, uniqueId, _id, isDelete }) => ({
                EmployeeId: EmployeeId.join(", "),
                EmployeeName: EmployeeName.join(", "),
                Type,
                Department,
                SRNumber,
                Date,
                Day,
                Country,
                State,
                City,
                ClientName,
                Purpose,
                Remarks,
                uniqueId,
                _id,
                isDelete
            }));
        });
        res.json(formattedData);
    } catch (error) {
        console.error("Error retrieving trip data:", error);
        res.status(500).send("Internal Server Error");
    }
}

// export async function handleTripDataDelete(req, res) {
//     const id = `${req.params.id}`;
//     try {
//         const deletedDocument = await Data.findOneDeleteOne({ "Data._id": id });
//         console.log(deletedDocument);
//         await DataformatingforSheet();
//         res.status(204).send();
//     } catch (error) {
//         console.error("Error deleting trip data:", error);
//         res.status(500).send("Internal Server Error");
//     }
// }

