import React, { useState } from 'react';
import { Modal, Input, Button, Row, Col, Form } from 'antd';
import api from '../services/api';

const AddEstimate = ({ visible, onClose, estimateToEdit }) => {
  const [estimate, setEstimate] = useState(
    estimateToEdit || {
      id: '',
      client: '',
      project: '',
      status: '',
      createdDate: new Date().toISOString().split('T')[0], // Set current date
      modifiedDate: new Date().toISOString().split('T')[0], // Set current date
      sections: [],
    }
  );

  const handleAddSection = () => {
    const newSection = { id: Date.now(), title: '', items: [] };
    setEstimate((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const handleAddItem = (sectionId) => {
    const newItem = { id: Date.now(), title: '', quantity: 0, price: 0, margin: 0 };
    setEstimate((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      ),
    }));
  };

  const handleSave = async () => {
    const now = new Date().toISOString().split('T')[0]; // Current date
    const updatedEstimate = {
      ...estimate,
      modifiedDate: now,
    };

    if (estimate.id) {
      // Update existing estimate
      await api.updateEstimate(estimate.id, updatedEstimate);
    } else {
      // Add new estimate
      updatedEstimate.createdDate = now;
      await api.addEstimate(updatedEstimate);
    }

    alert('Estimate saved!');
    onClose();
  };

  return (
    <Modal
      title={estimate.id ? "Edit Estimate" : "Add Estimate"}
      visible={visible}
      onOk={handleSave}
      onCancel={onClose}
      width={800}
    >
      <Form layout="vertical">
        <Form.Item label="Client">
          <Input
            value={estimate.client}
            onChange={(e) => setEstimate({ ...estimate, client: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Project">
          <Input
            value={estimate.project}
            onChange={(e) => setEstimate({ ...estimate, project: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Status">
          <Input
            value={estimate.status}
            onChange={(e) => setEstimate({ ...estimate, status: e.target.value })}
          />
        </Form.Item>
        <div>
          {estimate.sections.map((section, sectionIdx) => (
            <div key={section.id}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label={`Section ${sectionIdx + 1}`}>
                    <Input
                      value={section.title}
                      onChange={(e) =>
                        setEstimate((prev) => ({
                          ...prev,
                          sections: prev.sections.map((sec) =>
                            sec.id === section.id ? { ...sec, title: e.target.value } : sec
                          ),
                        }))
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label=' '>
                  <Button onClick={() => handleAddItem(section.id)}>+ Add Item</Button>
                </Form.Item>
                </Col>
              </Row>

              {section.items.map((item, itemIdx) => (
                <Row key={item.id} gutter={[16, 16]}>
                  <Col span={6}>
                    <Form.Item label={`Item ${itemIdx + 1} Title`}>
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          setEstimate((prev) => ({
                            ...prev,
                            sections: prev.sections.map((sec) =>
                              sec.id === section.id
                                ? {
                                    ...sec,
                                    items: sec.items.map((it) =>
                                      it.id === item.id ? { ...it, title: e.target.value } : it
                                    ),
                                  }
                                : sec
                            ),
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Quantity">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          setEstimate((prev) => ({
                            ...prev,
                            sections: prev.sections.map((sec) =>
                              sec.id === section.id
                                ? {
                                    ...sec,
                                    items: sec.items.map((it) =>
                                      it.id === item.id ? { ...it, quantity: e.target.value } : it
                                    ),
                                  }
                                : sec
                            ),
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Price">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          setEstimate((prev) => ({
                            ...prev,
                            sections: prev.sections.map((sec) =>
                              sec.id === section.id
                                ? {
                                    ...sec,
                                    items: sec.items.map((it) =>
                                      it.id === item.id ? { ...it, price: e.target.value } : it
                                    ),
                                  }
                                : sec
                            ),
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Margin %">
                      <Input
                        type="number"
                        value={item.margin}
                        onChange={(e) =>
                          setEstimate((prev) => ({
                            ...prev,
                            sections: prev.sections.map((sec) =>
                              sec.id === section.id
                                ? {
                                    ...sec,
                                    items: sec.items.map((it) =>
                                      it.id === item.id ? { ...it, margin: e.target.value } : it
                                    ),
                                  }
                                : sec
                            ),
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Total">
                      <Input
                        type="number"
                        value={
                          item.quantity * item.price +
                          (item.quantity * item.price * item.margin) / 100
                        }
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </div>
          ))}
        </div>

        <Button type="primary" onClick={handleAddSection}>
          + Add Section
        </Button>
      </Form>
    </Modal>
  );
};

export default AddEstimate;
