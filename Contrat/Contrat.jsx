import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Snackbar, Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { Header } from "../../components";
import AjouteContrat from "./AjouteContrat";
import AjouteClient from "../Client/AjouteClient";

const Contrat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialContractState = () => ({
    Date_debut: "",
    Heure_debut: "",
    Date_retour: "",
    Heure_retour: "",
    Duree_location: "",
    Prolongation: "",
    Numero_contrat: "",
    num_immatriculation: "",
    cin: "",
    Prix_total: "",
    Piece_garantie: "",
    Frais: "",
  });

  const initialClientState = () => ({
    nom_fr: "",
    nom_ar: "",
    prenom_fr: "",
    prenom_ar: "",
    cin: "",
    date_cin: "",
    date_naiss: "",
    adresse_fr: "",
    adresse_ar: "",
    num_tel: "",
    Numero_Permis: "",
    date_permis: "",
    profession_fr: "",
    profession_ar: "",
    nationalite_origine: "",
  });

  const [data, setData] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newContract, setNewContract] = useState(initialContractState());
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openAddClientDialog, setOpenAddClientDialog] = useState(false);
  const [newClient, setNewClient] = useState(initialClientState());

  useEffect(() => {
    fetchData();
    fetchAvailableVehicles();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7001/contrat");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching contracts", error);
    }
  };

  const fetchAvailableVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:7001/vehicules");
      setAvailableVehicles(response.data.data);
    } catch (error) {
      console.error("Error fetching available vehicles", error);
    }
  };

  const handleAddContract = async () => {
    try {
      console.log("New Contract Data:", newContract);
      const response = await axios.post(
        "http://localhost:7001/contrat",
        newContract
      );
      setData((prevData) => [...prevData, response.data]);
      setSnackbarMessage("Contract added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleAddClose(); // Close the dialog
    } catch (error) {
      console.error("Error adding contract", error);
      if (error.response) {
        console.error("Backend response:", error.response.data);
        setSnackbarMessage(
          "Error adding contract: " + error.response.data.error.join(", ")
        );
      } else {
        setSnackbarMessage("Error adding contract: " + error.message);
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const checkCINExists = async (cin) => {
    try {
      const response = await axios.get(
        `http://localhost:7001/client?cin=${cin}`
      );
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        const clientExists = response.data.data.some(
          (client) => client.cin === cin
        );
        return clientExists;
      } else {
        console.warn("Structure de réponse inattendue:", response.data);
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du CIN:", error);
      return false;
    }
  };

  const handleAddOpen = () => setOpenAddDialog(true);
  const handleAddClose = () => {
    setOpenAddDialog(false);
    setNewContract(initialContractState()); // Reset the form
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleAddClient = async () => {
    try {
      const response = await axios.post(
        "http://localhost:7001/client",
        newClient
      );
      setSnackbarMessage("Client added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenAddClientDialog(false);
      setNewClient(initialClientState());
      await fetchData();
      handleAddContract();
    } catch (error) {
      console.error("Error adding client", error);
      setSnackbarMessage(
        "Error adding client: " +
          (error.response ? error.response.data.message : "Unknown error")
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCINCheckAndAddContract = async () => {
    const cinExists = await checkCINExists(newContract.cin);
    console.log("CIN existe:", cinExists);
    if (!cinExists) {
      setOpenAddClientDialog(true);
    } else {
      handleAddContract();
    }
  };

  const columns = [
    { field: "Numero_contrat", headerName: "Numéro de Contrat", width: 180 },
    {
      field: "num_immatriculation",
      headerName: "Numéro d'Immatriculation",
      width: 180,
    },
    { field: "cin", headerName: "CIN", width: 150 },
    { field: "Date_debut", headerName: "Date de Début", width: 150 },
    { field: "Heure_debut", headerName: "Heure de Début", width: 150 },
    { field: "Date_retour", headerName: "Date de Retour", width: 150 },
    { field: "Heure_retour", headerName: "Heure de Retour", width: 150 },
    { field: "Duree_location", headerName: "Durée de Location", width: 150 },
    { field: "Prix_total", headerName: "Prix Total", width: 150 },
  ];

  return (
    <Box m="20px">
      <Header title="Contrats" />
      <Button
        variant="contained"
        sx={{ backgroundColor: "#3c55e2", color: "white" }}
        onClick={handleAddOpen}
      >
        Ajoute Contrat
      </Button>
      <Box mt="30px" height="70vh" width="130vh">
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.Numero_contrat}
          components={{ Toolbar: GridToolbar }}
          checkboxSelection
        />
      </Box>
      <AjouteContrat
  open={openAddDialog}
  handleClose={handleAddClose}
  newContract={newContract}
  setNewContract={setNewContract}
  handleAddContract={handleCINCheckAndAddContract}
  availableVehicles={availableVehicles}
/>
      <AjouteClient
        open={openAddClientDialog}
        handleClose={() => setOpenAddClientDialog(false)}
        newClient={newClient}
        setNewClient={setNewClient}
        handleAddClient={handleAddClient}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contrat;