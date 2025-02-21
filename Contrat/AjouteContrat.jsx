import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  TextField,
} from "@mui/material";

const AjouteContrat = ({
  open,
  handleClose,
  newContract,
  setNewContract,
  handleAddContract,
  availableVehicles,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewContract((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          fontSize: "1.4rem",
          fontWeight: "bold",
          textAlign: "center",
          bgcolor: "#1976d2",
          color: "white",
        }}
      >
        Ajouter un Contrat
      </DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            {[
              { name: "Date_debut", label: "Date Début", type: "date" },
              { name: "Heure_debut", label: "Heure Début", type: "time" },
              { name: "Date_retour", label: "Date Retour", type: "date" },
              { name: "Heure_retour", label: "Heure Retour", type: "time" },
              { name: "Duree_location", label: "Durée Location" },
              { name: "Prolongation", label: "Prolongation" },
              {
                name: "Numero_contrat",
                label: "Numéro Contrat",
                
              },
              { name: "cin", label: "CIN" },
              { name: "Prix_total", label: "Prix Total" },
              { name: "Piece_garantie", label: "Pièce Garantie" },
              { name: "Frais", label: "Frais" },
              {
                name: "num_immatriculation",
                label: "Numéro Immatriculation",
                type: "select",
                options: availableVehicles,
              },
            ].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                {field.type === "select" ? (
                  <FormControl fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      name={field.name}
                      value={newContract[field.name] || ""}
                      onChange={handleChange}
                    >
                      {field.options.map((vehicle, idx) => (
                        <MenuItem key={idx} value={vehicle.num_immatriculation}>
                          {vehicle.num_immatriculation}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    type={field.type || "text"}
                    value={newContract[field.name] || ""}
                    onChange={handleChange}
                    disabled={field.disabled}
                    InputLabelProps={
                      field.type === "date" ? { shrink: true } : {}
                    }
                    sx={{ mb: 2 }}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ padding: 2, justifyContent: "flex-end" }}>
        <Button
          onClick={handleAddContract}
          color="primary"
          variant="contained"
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            px: 3,
            py: 1.5,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Ajouter
        </Button>
        <Button
          onClick={handleClose}
          color="error"
          variant="outlined"
          sx={{
            bgcolor: "#d32f2f",
            color: "white",
            px: 3,
            py: 1.5,
            "&:hover": { bgcolor: "#b71c1c" },
          }}
        >
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AjouteContrat.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  newContract: PropTypes.object.isRequired,
  setNewContract: PropTypes.func.isRequired,
  handleAddContract: PropTypes.func.isRequired,
  availableVehicles: PropTypes.array.isRequired,
};

export default AjouteContrat;