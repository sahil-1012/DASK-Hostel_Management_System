const validator = require("validator");

const addHosteliteValidations = async (req, res, next) => {
    try {
        const { name, gender, email_id, dob, work, state, city, street, pincode, phone_no } = req.body.hosteliteData;
        const dobDate = new Date(dob);

        if (!name || !gender || !dob || !state || !city || !street || !pincode || !work || !phone_no) {
            return res.status(400).json({ error: "Missing required fields.", success: false });
        }

        else if (email_id && !validator.isEmail(email_id)) {
            return res.status(400).json({ error: "Invalid email address.", success: false });
        }

        else if (typeof name !== 'string' || typeof gender !== 'string' || typeof dob !== 'string' || typeof state !== 'string' || typeof city !== 'string' || typeof street !== 'string') {
            return res.status(400).json({ error: "Invalid data types for some fields.", success: false });
        }

        else if (gender !== 'Male' && gender !== 'Female' && gender !== 'other') {
            return res.status(400).json({ error: "Invalid gender value. Allowed values are 'Male', 'Female', or 'other'.", success: false });
        }

        else if (!Number.isInteger(pincode) || pincode < 10000 || pincode > 999999) {
            return res.status(400).json({ error: "Invalid pincode. pincode must be a 6-digit integer.", success: false });
        }

        else if (!dobDate || dobDate >= new Date()) {
            return res.status(400).json({ error: "Invalid date of birth. Date of birth must be a valid date in the past.", success: false });
        }
        
        else {
            next();
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error occurred while validating fields while adding the new Hostelite.", success: false });

    }
}


module.exports = addHosteliteValidations;
