import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Row, Col, Form } from 'antd';
import api from '../services/api';

const EditEstimate = ({ Id, onClose }) => {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstimate();
  }, [Id]);

  const fetchEstimate = async () => {
    setLoading(true);
    const response = await api.getEstimates();
    const selectedEstimate = response.find((e) => e.id === Id);
    setEstimate(selectedEstimate);
    setLoading(false);
  };

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
    await api.updateEstimate(Id, estimate);
    alert('Estimate saved!');
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="link"
            onClick={handleBack}
            style={{ marginRight: 16 }}
          >
            Back
          </Button>
          <span>Edit Estimate</span>
        </div>
      }
      loading={loading}
    >
      <Form layout="vertical">
        {estimate?.sections.map((section, sectionIdx) => (
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
                <Form.Item label=" ">
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

        <Button type="primary" onClick={handleAddSection}>
          + Add Section
        </Button>

        <Button type="primary" style={{ marginLeft: 16 }} onClick={handleSave}>
          Save Estimate
        </Button>
      </Form>
    </Card>
  );
};

export default EditEstimate;
