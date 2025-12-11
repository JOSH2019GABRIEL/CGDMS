import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import "../../../style/addorder.scss";
import "../../../style/new.scss";

const OrderInfoModal = ({ open, onClose, order, onConfirm }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Order Information</DialogTitle>

      <DialogContent dividers>
        <div className="modalOrderContainer">
          <div className="section">
            <h3>Customer Details</h3>
            <p><strong>Order Number:</strong> {order.orderNumber}</p>
            <p><strong>Name:</strong> {order.customerName}</p>
            <p><strong>Phone:</strong> {order.customerPhone}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Address:</strong> {order.deliveryAddress}</p>
            <p><strong>Category:</strong> {order.category}</p>
            <p><strong>Farm:</strong> {order.centerName}</p>
          </div>

          <div className="section">
            <h3>Order Items</h3>
            <div className="modalItems">
              {order.items?.map((item, idx) => (
                <div className="modalItemRow" key={idx}>
                  <span>{item.productName}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Unit: ₦{item.unitPrice}</span>
                  <strong>Total: ₦{(item.unitPrice * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="modalTotal">
              <h2>Total: ₦{order.totalAmount?.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        <Button 
          variant="contained" 
          color="primary"
          onClick={onConfirm}
        >
          Confirm Processing
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderInfoModal;
