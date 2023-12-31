const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { addHostelite, getHostelite, updateHostelite, updatedHostelitePassword, deleteHostelite } = require("../Operations/hosteliteOperations");

const requireAuth = require("../Middlewares/reqAuth");

const addHosteliteValidations = require("../Validations/HosteliteValidations/addHosteliteValidations");
const admissionDataValidations = require("../Validations/HosteliteValidations/admissionDataValidations");
const deleteHosteliteValidations = require("../Validations/HosteliteValidations/deleteHosteliteValidations");
const updateHosteliteValidations = require("../Validations/HosteliteValidations/updateHosteliteValidations");

router.use(express.json());

router.post("/addHostelite", addHosteliteValidations, admissionDataValidations, async (req, res) => {
    try {
        const { hosteliteData, admissionData, hosteliteDependentData } = req.body;

        const password = "Temp@123";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        hosteliteData.password = hash;

        const result = await addHostelite(hosteliteData, admissionData, hosteliteDependentData);
        const error = result.error;

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(409).json({ error, success: false });
        }

    } catch (error) {
        res.status(500).json({
            error: "An internal server error occurred while adding the branch: " + error.message,
            success: false,
        });
    }
});

router.get('/getHostelite', requireAuth, async (req, res) => {
    try {
        const userId = req.id;
        console.log(userId);
        const user = await getHostelite(userId)
        return res.status(200).json({ data: user.hostelite, success: true });

    } catch (error) {
        res.status(500).json({
            error: "An internal server error occurred while fetching the user details: " + error.message,
            success: false,
        });
    }
});

router.post('/updateHostelite', requireAuth, updateHosteliteValidations, async (req, res) => {
    const userId = parseInt(req.id);
    const { name, gender, email_id, dob, work,
        state, city, street, pincode, phone_no,
        h_dependents_name, h_dependents_phone_no, h_dependents_relationship
    } = req.body;
    const dobDate = new Date(dob);
    const hosteliteData = {
        name, gender, email_id, dob: dobDate, work, state,
        city, street, pincode, phone_no
    };

    const hosteliteDependentData = {
        name: h_dependents_name,
        phone_no: h_dependents_phone_no,
        relationship: h_dependents_relationship
    };
    console.log(hosteliteData, hosteliteDependentData)
    try {
        const updatedHostelite = await updateHostelite(userId, hosteliteData, hosteliteDependentData);

        if (updatedHostelite.success) {
            res.status(200).json(updatedHostelite);
        }
        else {
            res.status(400).json({ error: updatedHostelite.error, success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "An internal server error occurred while updating the user details: " + error.message,
            success: false,
        });
    }
});

router.put('/updatePassword', requireAuth, async (req, res) => {
    const userId = req.id;
    const hosteliteData = req.body;
    try {
        const updatedHostelite = await updatedHostelitePassword(userId, hosteliteData);

        if (updatedHostelite.success) {
            res.status(200).json({ message: "Password updated successfully" });
        }
        else {
            res.status(400).json({ error: updatedHostelite.error, success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "An internal server error occurred while updating the user details: " + error.message,
            success: false,
        });
    }
});

router.delete('/deleteHostelite', deleteHosteliteValidations, async (req, res) => {
    const id = req.body.id;
    const h_id = id.substring(1);
    try {
        const result = await deleteHostelite(h_id);

        if (result.success) {
            res.status(200).json({ message: 'Hostelite deleted successfully.' });
        } else {
            res.status(404).json({ error: result.error });
        }

    } catch (err) {
        console.error('Error in deleteHostelite route:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//  ~ HOSTELITE UTILITIES
router.get('/getPaymentDetails', async (req, res) => {
});
router.get('/addRequest', async (req, res) => {
});

module.exports = router;