import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from "@mui/material";
import axios from "axios";

function ModifieContrat({ open, handleClose, contrat, setContrat, handleUpdateContrat }) {
    // Check if contrat is null or undefined
    if (!contrat) {
        return null; // or return a loading state or a message
    }

    const { Numero_contrat, Date_debut, Heure_debut, Date_retour, Heure_retour, Duree_location, Prolongation, Id_vehicule, Prix_total, Piece_garantie, Frais, ID_contrat, ID_client } = contrat;

    const [clientDetails, setClientDetails] = useState({});
    const [vehiculeDetails, setVehiculeDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loadingClient, setLoadingClient] = useState(true);
    const [loadingVehicule, setLoadingVehicule] = useState(true);

    useEffect(() => {
        const fetchClientDetails = async () => {
            if (!ID_client) return;
            setLoadingClient(true);
            try {
                const response = await axios.get(`http://localhost:7001/client/${ID_client}`);
                setClientDetails(response.data?.data || {});
            } catch (err) {
                console.error("Erreur lors de la récupération des détails du client:", err);
                setError("Erreur lors de la récupération des détails du client");
            } finally {
                setLoadingClient(false);
            }
        };

        const fetchVehiculeDetails = async () => {
            if (!Id_vehicule) {
                console.warn("Id_vehicule is missing. Cannot fetch vehicle details.");
                setLoadingVehicule(false);
                setVehiculeDetails({});
                return;
            }

            setLoadingVehicule(true);
            setError("");
            try {
                const response = await axios.get(`http://localhost:7001/vehicules/${Id_vehicule}`);
                const vehicleData = response.data?.data || {};
                setVehiculeDetails(vehicleData);
            } catch (err) {
                console.error("Erreur lors de la récupération des détails du véhicule:", err);
                if (err.response && err.response.status === 404) {
                    setError(`Vehicle with ID ${Id_vehicule} not found.`);
                } else {
                    setError("Error fetching vehicle details. Check the console for details.");
                }
            } finally {
                setLoadingVehicule(false);
            }
        };

        fetchClientDetails();
        fetchVehiculeDetails();
    }, [contrat]);

    const handleChange = (field) => (event) => {
        setContrat({ ...contrat, [field]: event.target.value });
    };

    const handleUpdate = async () => {
        if (!contrat || !contrat.Numero_contrat) {
            console.error("Numero_contrat is missing or invalid");
            setError("Numero_contrat is missing or invalid");
            return;
        }

        const updatedContrat = {
            Numero_contrat: contrat.Numero_contrat,
            Date_debut: new Date(contrat.Date_debut).toISOString(),
            Heure_debut: contrat.Heure_debut,
            Date_retour: new Date(contrat.Date_retour).toISOString(),
            Heure_retour: contrat.Heure_retour,
            Duree_location: parseInt(contrat.Duree_location, 10),
            Prolongation: parseInt(contrat.Prolongation, 10),
            Id_vehicule: parseInt(contrat.Id_vehicule, 10),
            ID_client: parseInt(contrat.ID_client, 10),
            Prix_total: parseFloat(contrat.Prix_total),
            Piece_garantie: contrat.Piece_garantie || null,
            Frais: parseFloat(contrat.Frais),
        };

        try {
            const response = await axios.put(`http://localhost:7001/contrat/${contrat.ID_contrat}`, updatedContrat);
            handleUpdateContrat(response.data.data);
            handleClose(); // Close the dialog after updating
            setError('');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setError("Contrat non trouvé. Veuillez vérifier le numéro de contrat.");
                } else {
                    setError("Erreur lors de la mise à jour du contrat: " + (error.response.data.error || error.response.data.message));
                }
            } else {
                setError("Erreur lors de la mise à jour du contrat");
            }
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            sx={{ "& .MuiDialog-paper": { height: "85vh", maxHeight: "100vh", overflowY: "auto" } }}
        >
            <DialogTitle sx={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", bgcolor: "#1976d2", color: "white" }}>
                Modifier le Contrat
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {loading || loadingClient || loadingVehicule ? (
                    <CircularProgress />
                ) : (
                    <>
                        {error && <Typography color="error">{error}</Typography>}
                        <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 3 }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {[
                                        { label: "Numéro de Contrat", key: "Numero_contrat", readOnly: true },
                                        { label: "Date de Début", key: "Date_debut", type: "date" },
                                        { label: "Heure de Début", key: "Heure_debut" },
                                        { label: "Date de Retour", key: "Date_retour", type: "date" },
                                        { label: "Heure de Retour", key: "Heure_retour" },
                                        { label: "Durée de Location (jours)", key: "Duree_location", type: "number" },
                                        { label: "Prolongation", key: "Prolongation", type: "number" },
                                        { label: "Prix Total", key: "Prix_total", type: "number" },
                                        { label: "Pièce de Garantie", key: "Piece_garantie" },
                                        { label: "Frais", key: "Frais", type: "number" },
                                    ].map(({ label, key, type, readOnly }, index) => (
                                        <Grid item xs={12} sm={6} key={key || index}>
                                            <TextField
                                                label={label}
                                                type={type || "text"}
                                                fullWidth
                                                variant="outlined"
                                                value={contrat[key] || ""}
                                                onChange={readOnly ? undefined : handleChange(key)}
                                                InputLabelProps={type === "date" ? { shrink: true } : {}}
                                                InputProps={{ readOnly: readOnly }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                        {clientDetails && (
                            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 2, mt: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Détails du Client</Typography>
                                    <Grid container spacing={1.5}>
                                        {[
                                            { label: "Nom (FR)", value: clientDetails.nom_fr },
                                            { label: "Nom (AR)", value: clientDetails.nom_ar },
                                            { label: "Prénom (FR)", value: clientDetails.prenom_fr },
                                            { label: "Prénom (AR)", value: clientDetails.prenom_ar },
                                            { label: "CIN", value: clientDetails.cin },
                                            { label: "Date CIN", value: clientDetails.date_cin },
                                            { label: "Date de Naissance", value: clientDetails.date_naiss },
                                            { label: "Adresse (FR)", value: clientDetails.adresse_fr },
                                            { label: "Adresse (AR)", value: clientDetails.adresse_ar },
                                            { label: "Numéro de Téléphone", value: clientDetails.num_tel },
                                            { label: "Numéro de Permis", value: clientDetails.numero_permis },
                                            { label: "Date de Permis", value: clientDetails.date_permis },
                                            { label: "Profession (FR)", value: clientDetails.profession_fr },
                                            { label: "Profession (AR)", value: clientDetails.profession_ar },
                                            { label: "Nationalité d'Origine", value: clientDetails.nationalite_origine },
                                        ].map(({ label, value }, index) => (
                                            <Grid item xs={12} sm={6} key={label}>
                                                <TextField
                                                    label={label}
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={value || ""}
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                        {vehiculeDetails && (
                            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 2, mt: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Détails du Véhicule</Typography>
                                    <Grid container spacing={1.5}>
                                        {[
                                            { label: "Numéro Immatriculation", value: vehiculeDetails.num_immatriculation },
                                            { label: "Numéro de Châssis", value: vehiculeDetails.n_serie_du_type },
                                            { label: "Marque", value: vehiculeDetails.constructeur },
                                            { label: "Modèle", value: vehiculeDetails.type_constructeur },
                                            { label: "Carrosserie", value: vehiculeDetails.carrosserie },
                                            { label: "Énergie", value: vehiculeDetails.energie },
                                            { label: "Puissance Fiscale", value: vehiculeDetails.puissance_fiscale },
                                            { label: "Nombre de Places", value: vehiculeDetails.nbr_places },
                                            { label: "Cylindrée", value: vehiculeDetails.cylindree },
                                            { label: "Numéro Certificat", value: vehiculeDetails.num_certificat },
                                            { label: "Lieu Certificat", value: vehiculeDetails.lieu_certificat },
                                            { label: "Date Certificat", value: vehiculeDetails.date_certificat },
                                            { label: "Type Constructeur", value: vehiculeDetails.type_constructeur },
                                        ].map(({ label, value }, index) => (
                                            <Grid item xs={12} sm={6} key={label}>
                                                <TextField
                                                    label={label}
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={value || ""}
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#1565c0" } }}
                >
                    Modifier
                </Button>
                <Button
                    onClick={() => {
                        setContrat(null); // Reset the contract state if needed
                        handleClose(); // Close the dialog
                    }}
                    variant="contained"
                    sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, "&:hover": { bgcolor: "#b71c1c" } }}
                >
                    Annuler
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModifieContrat;