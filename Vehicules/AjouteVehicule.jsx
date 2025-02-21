import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper
} from '@mui/material';

function AjouteVehicule({ open, handleClose, newVehicle, setNewVehicle, categories, handleAddVehicle }) {
  const handleChange = (field) => (event) => {
    setNewVehicle({ ...newVehicle, [field]: event.target.value });
  };

  const marques = [
    "Alfa Romeo", "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Mercedes-Benz",
    "Peugeot", "Renault", "Volkswagen", "Chery", "Hyundai", "Kia", "Nissan",
    "Suzuki", "Toyota", "Chevrolet", "Ford", "Jeep"
  ];

  const energies = ["Essence", "Diesel", "Gaz", "Électrique", "Hybride"];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: '1.4rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>
        Ajouter un Véhicule
      </DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            {/* Champs de texte */}
            {[
              { label: "Numéro Immatriculation", field: "num_immatriculation" },
              { label: "Numéro de chassis", field: "n_serie_du_type" },
              { label: "Modele", field: "type_constructeur" },
              { label: "Carrosserie", field: "carrosserie" },
              { label: "Puissance Fiscale", field: "puissance_fiscale" },
              { label: "Nombre de Places", field: "nbr_places" },
              { label: "Cylindrée", field: "cylindree" },
              { label: "Numéro Certificat", field: "num_certificat" },
              { label: "Lieu Certificat", field: "lieu_certificat" },
              { label: "Type Commercial", field: "type_commercial" },
              { label: "Prix par jour", field: "prix_jour" }, // Corrected field name
            ].map(({ label, field }) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={label}
                  value={newVehicle[field] || ""}
                  onChange={handleChange(field)}
                  sx={{ mb: 2 }}
                  type={field === "prix_jour" ? "number" : "text"} // Set type to number for price
                />
              </Grid>
            ))}

            {/* Sélection de la marque */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Marque</InputLabel>
                <Select
                  value={newVehicle.constructeur || ""}
                  onChange={handleChange("constructeur")}
                  label="Marque"
                >
                  {marques.map((marque, index) => (
                    <MenuItem key={index} value={marque}>
                      {marque}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sélection de l'énergie */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Énergie</InputLabel>
                <Select
                  value={newVehicle.energie || ""}
                  onChange={handleChange("energie")}
                  label="Énergie"
                >
                  {energies.map((energie, index) => (
                    <MenuItem key={index} value={energie}>
                      {energie}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sélection de la catégorie */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={newVehicle.id_categorie || ""}
                  onChange={handleChange("id_categorie")}
                  label="Catégorie"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id_categorie} value={cat.id_categorie}>
                      {cat.catégorie}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sélection de la date du certificat */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Date Certificat"
                type="date"
                value={newVehicle.date_certificat || ""}
                onChange={handleChange("date_certificat")}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>

      {/* Boutons d'action */}
      <DialogActions sx={{ padding: 2, justifyContent: "flex-end" }}>
        <Button onClick={handleClose} color="error" variant="outlined" sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#b71c1c" } }}>
          Annuler
        </Button>
        <Button onClick={handleAddVehicle} color="primary" variant="contained" sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#1565c0" } }}>
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AjouteVehicule;