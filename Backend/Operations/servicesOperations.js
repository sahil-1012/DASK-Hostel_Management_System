const connection = require('../Connections/connect');

// ADD LAUNDRY WEIGHT

// ADD MESS DAYS 
// {
// ADD MESS DAYS THEN
// THEN ADD PAYMENT IN PAYMENTS TAB
// }


function calculateRemainingDays(endDate) {
    const currDate = new Date();
    const differenceInDays = Math.ceil((endDate - currDate) / (1000 * 60 * 60 * 24));
    return differenceInDays;
}

async function getMessData(hNo) {
    try {
        const [result] = await connection.query('SELECT end_date FROM mess WHERE hNo = ?', [hNo]);

        if (result.length > 0) {
            const { end_date } = result[0];
            const remainingDays = calculateRemainingDays(end_date);
            return { success: true, data: remainingDays };
        }
        else
            return { remainingDays: 0, success: true }

    } catch (err) {
        console.error('Error getting days:', err.message);
        return { error: "Error fetching Hostelite mess Details", success: false };
    }
}

function calculateNewEndDate(date, daysToAdd) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + parseInt(daysToAdd));
    return newDate;
}

async function addMessDays(hNo, daysToAdd, amount) {
    try {
        await connection.query('START TRANSACTION');

        // Add payment data
        const paymentDate = new Date();
            const [paymentResult] = await connection.query('INSERT INTO payments (from_user_id, amount, payment_date, payment_type, payment_category) VALUES (?, ?, ?, ?, ?)', [hNo, amount, paymentDate, 'Incoming', 'Mess']);

        if (paymentResult.affectedRows <= 0) {
            await connection.query('ROLLBACK');
            return { success: false, error: 'Error adding payment data.' };
        }

        // Update or insert mess data
        const [existingResult] = await connection.query('SELECT end_date FROM mess WHERE hNo = ?', [hNo]);

        let newEndDate;
        let startDate = new Date();

        try {
            if (existingResult.length > 0) {
                const oldEndDate = existingResult[0].end_date;
                newEndDate = calculateNewEndDate(new Date(oldEndDate), daysToAdd);
                const [updateResult] = await connection.query('UPDATE mess SET end_date = ?, start_date = ? WHERE hNo = ?', [newEndDate, startDate, hNo]);

                if (updateResult.affectedRows <= 0) {
                    await connection.query('ROLLBACK');
                    return { success: false, error: 'Error updating mess data.' };
                }
            } else {
                newEndDate = calculateNewEndDate(startDate, daysToAdd);
                const [insertResult] = await connection.query('INSERT INTO mess (hNo, end_date, start_date) VALUES (?, ?, ?)', [hNo, newEndDate, startDate]);

                if (insertResult.affectedRows <= 0) {
                    await connection.query('ROLLBACK');
                    return { success: false, error: 'Error inserting mess data.' };
                }
            }

            await connection.query('COMMIT');
            return { success: true, message: 'Days added successfully.' };
        } catch (error) {
            await connection.query('ROLLBACK');
            console.error('Error in database operation:', error);
            return { success: false, error: 'Internal server error' };
        }
    } catch (err) {
        console.error('Error adding days:', err);
        return { success: false, error: 'Internal server error' };
    }
}

async function getLaundryWeight(hNo) {
    try {
        const [result] = await connection.query('SELECT weight_left FROM laundry WHERE hNo = ?', [hNo]);

        if (result.length > 0) {
            const laundryWeight = result[0].weight_left;
            return { success: true, data: laundryWeight };
        }
        else
            return { success: true, data: 0 };

    } catch (err) {
        console.error('Error getting laundry weight:', err);
        return { success: false, error: 'Internal server error' };
    }
}
    
async function addLaundryWeight(hNo, weightToAdd, amount) {
    try {
        await connection.query('START TRANSACTION');

        const [result] = await connection.query('SELECT weight_left FROM laundry WHERE hNo = ?', [hNo]);

        let currentWeight = 0;

        if (result.length > 0) {
            currentWeight = result[0].weight_left;
        }

        const newWeight = parseInt(currentWeight) + parseInt(weightToAdd);

        // Update or insert into laundry table
        const query = result.length > 0
            ? 'UPDATE laundry SET weight_left = ? WHERE hNo = ?'
            : 'INSERT INTO laundry (weight_left,hNo) VALUES (?, ?)';

        const [updateResult] = await connection.query(query, [newWeight, hNo]);

        // Insert into payments table
        const paymentDate = new Date();
        const [paymentResult] = await connection.query('INSERT INTO payments (from_user_id, amount, payment_date, payment_type, payment_category) VALUES (?, ?, ?, ?, ?)', [hNo, amount, paymentDate, 'Incoming', 'Laundry']);

        if (updateResult.affectedRows > 0 && paymentResult.affectedRows > 0) {
            await connection.query('COMMIT');
            return { success: true, data: newWeight, message: 'Laundry weight added successfully.' };
        } else {
            await connection.query('ROLLBACK');
            return { success: false, error: 'Error adding laundry weight or payment.' };
        }

    } catch (err) {
        await connection.query('ROLLBACK');
        console.error('Error adding laundry weight:', err);
        return { success: false, error: 'Internal server error' };
    }
}

module.exports = { getMessData, addMessDays, getLaundryWeight, addLaundryWeight }