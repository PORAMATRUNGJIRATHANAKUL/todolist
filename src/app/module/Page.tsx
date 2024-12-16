"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

interface PersonInfo {
  id: number;
  firstName: string;
  lastName: string;
  age: string;
  birthDate: string;
  gender: string;
  nationality: string;
}

export const Page = () => {
  const [people, setPeople] = useState<PersonInfo[]>([]);
  const [formData, setFormData] = useState<Omit<PersonInfo, "id">>({
    firstName: "",
    lastName: "",
    age: "",
    birthDate: "",
    gender: "",
    nationality: "",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersonInfo | null>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  useEffect(() => {
    const savedPeople = localStorage.getItem("people");
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    } else {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      if (data.users) {
        setPeople(data.users);
        localStorage.setItem("people", JSON.stringify(data.users));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const savedPeople = localStorage.getItem("people");
      if (savedPeople) {
        setPeople(JSON.parse(savedPeople));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const showAlert = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.age ||
      !formData.birthDate ||
      !formData.gender ||
      !formData.nationality
    ) {
      showAlert("Please fill in all fields", "error");
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Date.now(),
          ...formData,
        }),
      });

      if (response.ok) {
        fetchUsers();
        setFormData({
          firstName: "",
          lastName: "",
          age: "",
          birthDate: "",
          gender: "",
          nationality: "",
        });
        localStorage.removeItem("formData");
        showAlert("Person added successfully!", "success");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      showAlert("Error adding person", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUsers();
        showAlert("Person deleted successfully!", "success");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showAlert("Error deleting person", "error");
    }
  };

  const handleEdit = (person: PersonInfo) => {
    setEditingPerson(person);
    setFormData({
      firstName: person.firstName,
      lastName: person.lastName,
      age: person.age,
      birthDate: person.birthDate,
      gender: person.gender,
      nationality: person.nationality,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingPerson) {
      try {
        const response = await fetch("/api/posts", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingPerson.id,
            ...formData,
          }),
        });

        if (response.ok) {
          fetchUsers();
          setEditDialogOpen(false);
          setEditingPerson(null);
          setFormData({
            firstName: "",
            lastName: "",
            age: "",
            birthDate: "",
            gender: "",
            nationality: "",
          });
          showAlert("Person updated successfully!", "success");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        showAlert("Error updating person", "error");
      }
    }
  };

  const TableRowContent = (person: PersonInfo) => (
    <TableRow key={person.id} hover>
      <TableCell>{person.firstName}</TableCell>
      <TableCell>{person.lastName}</TableCell>
      <TableCell>{person.age}</TableCell>
      <TableCell>{person.birthDate}</TableCell>
      <TableCell>{person.gender}</TableCell>
      <TableCell>{person.nationality}</TableCell>
      <TableCell>
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleEdit(person)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDelete(person.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Person Management System
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Add New Person
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gap: 2.5,
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                mb: 3,
              }}
            >
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Birth Date"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                type="submit"
                startIcon={<AddIcon />}
                sx={{ px: 4 }}
              >
                Add Person
              </Button>
            </Box>
          </form>
        </Paper>

        <Paper elevation={3}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "white" }}>First Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Last Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Age</TableCell>
                  <TableCell sx={{ color: "white" }}>Birth Date</TableCell>
                  <TableCell sx={{ color: "white" }}>Gender</TableCell>
                  <TableCell sx={{ color: "white" }}>Nationality</TableCell>
                  <TableCell sx={{ color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {people.map((person) => TableRowContent(person))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Person</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              pt: 2,
              display: "grid",
              gap: 2.5,
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Birth Date"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleSelectChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
